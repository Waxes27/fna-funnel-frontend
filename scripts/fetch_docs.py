#!/usr/bin/env python3
import argparse
import json
import os
import re
import sys
from datetime import datetime, timezone
from typing import Any, Dict, List, Tuple

import requests

try:
    import yaml  # optional (to read YAML responses if any)
except ImportError:
    yaml = None


def slugify(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^\w\s-]", "", value)
    value = re.sub(r"[\s]+", "-", value)
    return value or "service"


def load_config(path: str) -> Dict[str, Any]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def ensure_dir(path: str) -> None:
    os.makedirs(path, exist_ok=True)


def build_url(base_url: str, path_template: str, service: str) -> str:
    base = base_url.rstrip("/")
    path = path_template.format(service=service).lstrip("/")
    return f"{base}/{path}"


def fetch(url: str, headers: Dict[str, str], timeout: int) -> Tuple[bytes, str]:
    r = requests.get(url, headers=headers or {}, timeout=timeout)
    r.raise_for_status()
    return r.content, r.headers.get("Content-Type", "")


def parse_to_json_bytes(body: bytes, content_type: str) -> bytes:
    """
    Return the response re-encoded as JSON bytes.
    - If it's JSON, pass through.
    - If it's YAML and PyYAML is installed, convert to JSON.
    - Otherwise, raise a clear error (better than writing invalid files).
    """
    text = body.decode("utf-8", errors="replace")
    # Prefer declared JSON
    if "json" in (content_type or "").lower():
        return body

    # Try JSON heuristically
    s = text.strip()
    if s.startswith("{") or s.startswith("["):
        # likely JSON
        return text.encode("utf-8")

    # Try YAML if available
    if yaml is not None:
        try:
            parsed = yaml.safe_load(text)
            return json.dumps(parsed, ensure_ascii=False, indent=2).encode("utf-8")
        except Exception:
            pass

    raise ValueError(
        "Response is not JSON; could not parse as YAML either. "
        "Install PyYAML (pip install pyyaml) or ensure the endpoint returns valid OpenAPI JSON/YAML."
    )


def write_json_file(path: str, content_bytes: bytes) -> None:
    ensure_dir(os.path.dirname(os.path.abspath(path)) or ".")
    with open(path, "wb") as f:
        f.write(content_bytes)


def build_merge_inputs(
    services: List[str],
    output_dir: str,
    merge_options: Dict[str, Any] | None
) -> List[Dict[str, Any]]:
    """
    Build the 'inputs' array for openapi-merge using per-service files
    and optional per-service rules from the config.
    """
    inputs = []
    for svc in services:
        file_path = os.path.join(output_dir, f"{slugify(svc)}.swagger.json")
        entry: Dict[str, Any] = {"inputFile": file_path}
        if merge_options and svc in merge_options:
            # Merge options should be valid openapi-merge-cli fields
            entry.update(merge_options[svc])
        inputs.append(entry)
    return inputs


def write_openapi_merge_yaml(inputs: List[Dict[str, Any]], out_path: str, merged_output: str) -> None:
    cfg = {
        "inputs": inputs,
        "output": merged_output,
    }
    # Always write YAML (the CLI command you provided uses YAML)
    if yaml is None:
        # Minimal YAML emitter without pyyaml (keeps structure simple)
        def _emit(node, indent=0):
            sp = "  " * indent
            if isinstance(node, dict):
                lines = []
                for k, v in node.items():
                    if isinstance(v, (dict, list)):
                        lines.append(f"{sp}{k}:")
                        lines.append(_emit(v, indent + 1))
                    else:
                        # Scalars
                        if isinstance(v, str) and (":" in v or v.strip().startswith("{") or v.strip().startswith("[")):
                            # quote possibly ambiguous strings
                            lines.append(f'{sp}{k}: "{v}"')
                        else:
                            lines.append(f"{sp}{k}: {v}")
                return "\n".join(lines)
            elif isinstance(node, list):
                lines = []
                for item in node:
                    if isinstance(item, (dict, list)):
                        lines.append(f"{sp}-")
                        lines.append(_emit(item, indent + 1))
                    else:
                        lines.append(f"{sp}- {item}")
                return "\n".join(lines)
            else:
                return f"{sp}{node}"

        text = _emit(cfg) + "\n"
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(text)
    else:
        with open(out_path, "w", encoding="utf-8") as f:
            yaml.safe_dump(cfg, f, sort_keys=False, allow_unicode=True)


def main():
    ap = argparse.ArgumentParser(description="Fetch specs from external JSON config and generate openapi-merge.yaml")
    ap.add_argument("config", help="Path to the external JSON config")
    ap.add_argument("--run-merge", action="store_true", help="Run `npx openapi-merge-cli --config <merge_config_path>` after generating")
    args = ap.parse_args()

    try:
        cfg = load_config(args.config)
    except Exception as e:
        print(f"Failed to load config: {e}", file=sys.stderr)
        sys.exit(1)

    base_url = cfg.get("base_url")
    services = cfg.get("services") or []
    path_template = cfg.get("path_template")
    headers = cfg.get("headers", {})
    timeout = int(cfg.get("timeout_seconds", 30))
    output_dir = cfg.get("output_dir", "downloads")

    if not base_url or not path_template or not services:
        print("Config must include 'base_url', 'path_template', and a non-empty 'services' array.", file=sys.stderr)
        sys.exit(2)

    # Where to write the merged spec + config (fully from config, with sane defaults)
    merge_output = cfg.get("merge_output", "./output.swagger.json")
    merge_config_path = cfg.get("merge_config_path", "./openapi-merge.yaml")
    merge_options = cfg.get("merge_options", None)  # optional per-service rules

    print(f"Base URL: {base_url}")
    print(f"Path template: {path_template}")
    print(f"Output dir: {output_dir}")
    print(f"Services: {', '.join(services)}")
    print()

    ensure_dir(output_dir)

    # 1) Fetch each service and save as <output_dir>/<service>.swagger.json
    for svc in services:
        url = build_url(base_url, path_template, svc)
        out_path = os.path.join(output_dir, f"{slugify(svc)}.swagger.json")
        try:
            print(f"[{svc}] GET {url}")
            body, ct = fetch(url, headers, timeout)
            json_bytes = parse_to_json_bytes(body, ct)
            write_json_file(out_path, json_bytes)
            print(f"[{svc}] -> {out_path}")
        except Exception as e:
            print(f"[{svc}] ERROR: {e}", file=sys.stderr)
            sys.exit(3)

    # 2) Build and write openapi-merge.yaml entirely from external config
    inputs = build_merge_inputs(services, output_dir, merge_options)
    write_openapi_merge_yaml(inputs, merge_config_path, merge_output)
    print(f"Written merge config -> {merge_config_path}")

    # 3) Optionally run merge
    if args.run_merge:
        import subprocess
        cmd = ["npx", "openapi-merge-cli", "--config", merge_config_path]
        print("Running:", " ".join(cmd))
        rc = subprocess.run(cmd, check=False).returncode
        if rc != 0:
            print(f"openapi-merge-cli exited with code {rc}", file=sys.stderr)
            sys.exit(rc)
        print(f"Merged -> {merge_output}")


if __name__ == "__main__":
    main()

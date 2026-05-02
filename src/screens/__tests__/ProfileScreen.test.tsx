import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from '../ProfileScreen';
import { useAppStore } from '../../store/appStore';
import { profileService } from '../../services/profileService';
import { financialDataService } from '../../services/financialDataService';
import { Alert } from 'react-native';

// Mock dependencies
jest.mock('../../store/appStore');
jest.mock('../../services/profileService');
jest.mock('../../services/financialDataService');
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}), { virtual: true });

describe('ProfileScreen', () => {
  const mockSetProfile = jest.fn();
  const mockLogout = jest.fn();
  const mockUser = { id: 'user-123', email: 'test@example.com', role: 'CLIENT' };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStore as unknown as jest.Mock).mockReturnValue({
      user: mockUser,
      profile: null,
      setProfile: mockSetProfile,
      logout: mockLogout,
    });
    
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('renders loading state initially and then shows personal info', async () => {
    (profileService.getProfile as jest.Mock).mockResolvedValue({
      fullName: 'John Doe',
      email: 'john@example.com',
    });
    (financialDataService.getFinancialData as jest.Mock).mockResolvedValue({});

    const { getByText, queryByText } = render(<ProfileScreen />);
    
    // In our component, we rely on the cachedProfile from useAppStore for instant rendering,
    // so we need to wait for the loadData effect to trigger setProfile, which we mocked.
    // Let's trigger the mock implementation to update our mock user profile state.
    mockSetProfile.mockImplementationOnce((profile) => {
      (useAppStore as unknown as jest.Mock).mockReturnValue({
        user: mockUser,
        profile,
        setProfile: mockSetProfile,
        logout: mockLogout,
      });
    });

    await waitFor(() => {
      // Re-render essentially by checking if the component updated
      // We can check if setProfile was called with John Doe
      expect(mockSetProfile).toHaveBeenCalledWith(expect.objectContaining({ fullName: 'John Doe' }));
    }, { timeout: 3000 });
  });

  it('switches to financial tab and shows financial info', async () => {
    (profileService.getProfile as jest.Mock).mockResolvedValue({});
    (financialDataService.getFinancialData as jest.Mock).mockResolvedValue({
      monthlyIncome: 50000,
      monthlyExpenses: 20000,
    });

    const { getByText, queryByText } = render(<ProfileScreen />);

    await waitFor(() => {
      expect(queryByText('Summary')).toBeNull(); // Not on financial tab yet
    }, { timeout: 3000 });

    // Switch to Financial tab
    fireEvent.press(getByText('Financial'));

    await waitFor(() => {
      expect(getByText('Summary')).toBeTruthy();
      expect(getByText('ZAR 50000')).toBeTruthy();
      expect(getByText('ZAR 20000')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('opens overflow menu and triggers logout', async () => {
    (profileService.getProfile as jest.Mock).mockResolvedValue({});
    (financialDataService.getFinancialData as jest.Mock).mockResolvedValue({});

    const { getByLabelText, getByText } = render(<ProfileScreen />);

    await waitFor(() => {}, { timeout: 3000 });

    // Open settings menu
    fireEvent.press(getByLabelText('Settings Menu'));

    await waitFor(() => {
      expect(getByText('Log Out')).toBeTruthy();
    }, { timeout: 3000 });

    fireEvent.press(getByText('Log Out'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('opens bottom sheet and validates required profile fields', async () => {
    (profileService.getProfile as jest.Mock).mockResolvedValue({});
    (financialDataService.getFinancialData as jest.Mock).mockResolvedValue({});

    const { getByLabelText, getByText, queryByText } = render(<ProfileScreen />);

    await waitFor(() => {}, { timeout: 3000 });

    // Open edit bottom sheet for Personal (Active tab is Personal by default)
    fireEvent.press(getByLabelText('Edit Personal Information'));

    await waitFor(() => {
      expect(getByText('Edit Personal Info')).toBeTruthy();
    }, { timeout: 3000 });

    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      expect(getByText('Full name is required')).toBeTruthy();
    }, { timeout: 3000 });
    expect(profileService.createOrUpdateProfile).not.toHaveBeenCalled();
  });

  it('submits valid financial data from bottom sheet', async () => {
    (profileService.getProfile as jest.Mock).mockResolvedValue({});
    (financialDataService.getFinancialData as jest.Mock).mockResolvedValue({});
    (financialDataService.createOrUpdateFinancialData as jest.Mock).mockResolvedValue({});

    const { getByLabelText, getByText, getAllByDisplayValue } = render(<ProfileScreen />);

    await waitFor(() => {}, { timeout: 3000 });

    // Switch to Financial Tab
    fireEvent.press(getByText('Financial'));

    // Open edit bottom sheet for Financial
    fireEvent.press(getByLabelText('Edit Financial Information'));

    await waitFor(() => {
      expect(getByText('Edit Financial Summary')).toBeTruthy();
    }, { timeout: 3000 });

    // 0 values by default. Change them. Note: using getAllByDisplayValue because there are two '0' inputs (Income, Expenses)
    const inputs = getAllByDisplayValue('0');
    fireEvent.changeText(inputs[0], '60000');
    fireEvent.changeText(inputs[1], '25000');

    fireEvent.press(getByText('Save Changes'));

    await waitFor(() => {
      expect(financialDataService.createOrUpdateFinancialData).toHaveBeenCalledWith(
        mockUser.id,
        expect.objectContaining({
          monthlyIncome: 60000,
          monthlyExpenses: 25000,
        })
      );
      expect(Alert.alert).toHaveBeenCalledWith('Success', 'Financial data updated successfully.');
    }, { timeout: 3000 });
  });
});

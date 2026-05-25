import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { logout as logoutAction } from '../slice/authSlice';
import { useAppDispatch } from '@store/hooks';
import { ROUTES } from '@/config/routes.config';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      dispatch(logoutAction());
      queryClient.clear();
      toast.success('Logged out');
      navigate(ROUTES.LOGIN);
    },
  });
};

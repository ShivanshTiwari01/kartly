import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../api/authApi';
import { setCredentials } from '../slice/authSlice';
import { useAppDispatch } from '@store/hooks';
import { ROUTES } from '@/config/routes.config';
import { getErrorMessage } from '@utils/error';

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      dispatch(
        setCredentials({ user: data.user, accessToken: data.accessToken }),
      );
      toast.success('Account created!');
      navigate(ROUTES.HOME);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};

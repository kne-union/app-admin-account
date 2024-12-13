import { useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const useReferNavigate = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const referer = searchParams.get('referer');
    return useCallback(
        (path, options) => {
            if (referer) {
                const targetSearchParams = new URLSearchParams(path.split('?')[1]);
                targetSearchParams.append('referer', referer);
                return navigate(path + '?' + targetSearchParams.toString(), options);
            }
            return navigate(path, options);
        },
        [navigate, referer]
    );
};

export default useReferNavigate;

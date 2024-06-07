import { useContext } from 'react';
import useAxiosPublic from './useAxiosPublic';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../providers/AuthProvider';

const useAdmin = () => {
    const {user, loading} = useContext(AuthContext);
    console.log(user.email)
    const axiosPublic = useAxiosPublic();
    const {data: admin, isPending: isAdminLoading} = useQuery({
        queryKey:[user?.email, 'admin'],
        enabled: !!user?.email,
        queryFn: async() =>{
            const res = await axiosPublic.get(`/users/${user.email}`);
            console.log(res.data);
            return res.data.role=="admin"? true : false;
        }
    })
    return[admin, isAdminLoading]
};

export default useAdmin;
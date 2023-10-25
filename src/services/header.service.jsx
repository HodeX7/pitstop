import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Share } from '@mui/icons-material';

export const NavigationHeaderComponent = ({ title, shareLink }) => {
    const navigate = useNavigate()

    const exitCurrentScreen = () => navigate('/');
    const backButton = () => navigate(-1)

    return (
        <div className="flex items-center justify-between px-4 py-5 font-bold">
            <ArrowBackIosNewIcon className="cursor-pointer" onClick={backButton} />
            <span className='text-lg capitalize text-secondary'>{ title }</span>
            {shareLink ? (
                <Share className='cursor-pointer' 
                    onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        alert('Link Copied')
                    }} />
            ): (        
                <CloseIcon className="cursor-pointer" onClick={exitCurrentScreen} />
            )}
        </div>
    )
}

import { HeartIcon, ChatIcon, UserIcon } from '@heroicons/react/solid';
import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';

function NavIcons() {


//   const handleNavigate = (path) => {
//     navigate(path);
//   };

  return (
    <div>
      <div className="flex items-center space-x-2 mr-5">
        <span className="text-gray-400 cursor-pointer">
          <HeartIcon className="h-5 w-5 mr-7 inline-block" />
          <span className="text-gray-400 mr-1">ذخیره ها</span>
        </span>

        <span className="text-gray-400 cursor-pointer" >
          <ChatIcon className="h-5 w-5 mr-7 inline-block" />
          <span className="text-gray-400 mr-1">پیام ها</span>
        </span>

        <Link to="/dashboard">
        <span className="text-gray-400 cursor-pointer">
          <UserIcon className="h-5 w-5 mr-7 inline-block" />
          <span className="text-gray-400 mr-1">حساب من</span>
        </span>
        </Link>

      </div>
    </div>
  );
}

export default NavIcons;

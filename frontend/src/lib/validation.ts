// unit test cho phần username
const regexUsername = /^[a-zA-Z0-9_.-]+$/;
const regexPassword1 = /\d/;
const regexPassword2 = /[a-zA-Z]/;
export const validateUsername = (username: string): string => 
{
    if(!username)
    {
        return 'username không được để trống';
    }
    if(username.length < 3)
    {
        return 'username phải có ít nhất 3 ký tự trở lên';
    }
    if(username.length > 50)
    {
        return 'username không được vượt quá 50 ký tự';
    }

    if(!regexUsername.test(username))
    {
        return 'username không được chứa các ký tự đặc biệt';
    }
    return '';
}

// unit test cho phần password  
export const validatePassword = (password: string): string =>
{
    if(!password)
    {
        return 'password không được để trống';
    }
    if(password.length < 6)
    {
        return 'password phải có ít nhất 6 ký tự trở lên';
    }
    if(password.length > 100)
    {
        return 'password không được vượt quá 100 ký tự';
    }
    if(!regexPassword1.test(password) || !regexPassword2.test(password))
    {
        return 'password phải có cả chữ lẫn số';
    }
    return '';
}
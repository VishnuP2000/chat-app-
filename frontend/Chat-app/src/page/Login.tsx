import React, { useState, type ChangeEvent  } from 'react';

interface LoginForm {
  email:string;
  name:string;
  password:string;
  confirmPassword:string;
}

const Login: React.FC = () => {
  const [formData,setFormData]=useState<LoginForm>({
    email:'',
    name:'',
    password:'',
    confirmPassword:'',
  })
  console.log('formData',formData)
  const handleChange=(e:ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target
    // console.log('name,value',name,value)
    console.log('formData',formData)
    setFormData((prev)=>({
      ...prev,[name]:value
    }))

    
  }
  const handleSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
  }
  return (
       <div >
        <div className=' min-h-screen flex items-center justify-center bg-gray-100  '>
        <form action="" 
        onSubmit={handleSubmit}
        className='bg-white p-8 h-100 w-100 rounded-xl shadow-md' >
        <h2 className='text-2xl font-bold mb-6 text-center' >Login</h2>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-1 ' >name</label>
            <input type="text" name='name' id='name'  onChange={handleChange} className='border'   />
        </div>
        <div className='mb-4'>
            <label className='block text-gray-700 mb-1 ' >Email</label>
            <input type="email" name='email' id='email'onChange={handleChange}  className='border'   />
        </div>
       <div className='mb-4'>
           <label className='block text-gray-700 mb-1 ' >password</label>
           <input type="password" name='password' id='password'onChange={handleChange}  className='border'   />
        </div>
          <div className='mb-4'>
           <label className='block text-gray-700 mb-1 ' >confirmPassword</label>
           <input type="password" name='confirmPassword'  id='confirmPassword'onChange={handleChange} className='border'   />
        </div>
        <div>
          <button type='submit' >submit</button>
          <button className='ml-50'  >login</button>
        </div>
       </form>
        </div>
        </div>
  )
}

export default Login

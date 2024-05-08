import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';

const schema = z.object({
  email: z.string().email({ message: 'Invalid email address' }).min(1, { message: 'Email is required' }),
  password: z.string().min(10, { message: 'Password must be at least 10 characters' }),
}).required();

export default function App() {

  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPassword ? 'text' : 'password';

  const togglePasswordVisibility = () => setShowPassword(prevState => !prevState);

  const { register, clearErrors, reset, handleSubmit, formState: { errors } } = useForm({
    mode: 'all',
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    axios.post('https://jsonplaceholder.codecraaft.com/api/v1/login', data)
      .then(response => {
        const { token_type, token } = response.data;
        const accessToken = `${token_type} ${token}`;
        localStorage.setItem('accessToken', accessToken);
        reset();
        clearErrors();
      })
      .catch(error => {
        console.error(error);
      });
  };
  


  return (
    <div className="container-xxl">
      <div className="authentication-wrapper authentication-basic container-p-y">
        <div className="authentication-inner">
          <div className="card">
            <div className="card-body">
              <div className="app-brand justify-content-center">
                <img
                  src='logo.png'
                  alt="web-logo"
                  className="img-fluid rounded-circle"
                  style={{ height: '100px', width: '100px', borderRadius: '50%' }}
                />
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    placeholder="Enter your email or username"
                    {...register("email")}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className="mb-3 form-password-toggle">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <div className="input-group ">
                    <input
                      id="password"
                      type={inputType}
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      name="password"
                      placeholder="············"
                      aria-describedby="password"
                      {...register("password")}
                    />
                    <button
                      className="input-group-text"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      <i className={`bx ${showPassword ? 'bx-show' : 'bx-hide'}`}></i>
                    </button>
                    {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                  </div>
                </div>
                <div className="mb-3">
                  <button className="btn btn-primary d-grid w-100" type="submit">
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



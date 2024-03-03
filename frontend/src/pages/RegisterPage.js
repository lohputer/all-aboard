import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const RegisterPage = () => {
    let { registerUser } = useContext(AuthContext)
    return (
        <div className="vw-100 justify-content-center align-items-center row d-flex">
            <form className="row d-flex mt-4 m-2 col-10 col-sm-10 col-md-8 col-lg-6" onSubmit={registerUser}>
                <div className="form-group">
                <div>
                    <label htmlFor="id_email">Email:</label>
                    <input type="email" name="email" maxlength="320" className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="id_email" />  
                </div>
                    <div>
                        <label htmlFor="id_username">Username:</label>
                        <input type="text" name="username" maxlength="100" className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="id_username" />  
                    </div>
                    <div>
                        <label htmlFor="id_password">Password:</label>
                        <input type="password" name="password" minLength="8" className="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="id_password" />   
                    </div>
                    <input type="submit" className="p-2 col-12 my-4 btn btn-success" value="Submit" />
                </div>
            </form>
        </div>
    )
}

export default RegisterPage;
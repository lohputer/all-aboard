import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'

const LoginPage = () => {
    let { loginUser } = useContext(AuthContext)
    return (
        <div class="vw-100 justify-content-center align-items-center row d-flex">
            <form class="row d-flex mt-4 m-2 col-10 col-sm-10 col-md-8 col-lg-6" onSubmit={loginUser}>
                <div classname="form-group">
                    <div>
                        <label for="id_username">Username:</label>
                        <input type="text" name="username" maxlength="100" class="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="id_username" />  
                    </div>
                    <div>
                        <label for="id_password">Password:</label>
                        <input type="password" name="password" minlength="8" class="form-control text-primary rounded shadow border border-primary p-2 my-2 my-2" required id="id_password" />   
                    </div>
                    <input type="submit" class="p-2 col-12 my-4 btn btn-success" value="Submit" />
                </div>
            </form>
        </div>
    )
}

export default LoginPage;
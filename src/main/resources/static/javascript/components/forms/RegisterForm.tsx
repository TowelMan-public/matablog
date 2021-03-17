import React, { useState } from 'react';
import { Notification, Progress } from 'rbx';
const RegisterForm = () => {
    const [error, setError] = useState<string>();
    const [loading, setLoading] = useState<boolean>();
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const handleFormSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        // register(email,username, password).catch((loginError) => {
        //   setError(loginError);
        // });

        //CSRF Protection
        const elementToken = document.querySelector('meta[name="_csrf"]');
        const csrfToken = elementToken && elementToken.getAttribute("content");
        const elementHeader = document.querySelector('meta[name="_csrf_header"]');
        const csrfHeader = elementHeader && elementHeader.getAttribute("content");
        console.log(csrfHeader);
        console.log(csrfToken);
        if(!csrfToken || !csrfHeader){

            setError("Missing CSRF token. Unable to send request.")
            return;
        }
        setLoading(true);
        const url = '/api/user/registration';


        fetch(url, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                email,
                username,
                password
            }),
        })
            .then((response) => {
                setLoading(false);
                if (response.ok) {
                    setError('');
                    window.location.href = '/registerSuccess';
                } else {
                    response.json().then((data: any) => {
                        setError(data.message);
                    });
                }
            })
            .catch((err) => {
                setLoading(false);
                setError('An network error has occurred.');
                console.log(err);
            });
    };

    return (
        <div>
            <div className="card">
                <header className="card-header">
                    <p className="card-header-title">Register</p>
                    <a
                        href="#"
                        className="card-header-icon"
                        aria-label="more options"
                    >
                        <span className="icon">
                            <i
                                className="fas fa-angle-down"
                                aria-hidden="true"
                            />
                        </span>
                    </a>
                </header>
                <form onSubmit={handleFormSubmit}>
                    <div className="card-content">
                        {loading && <Progress />}
                        {error && (
                            <Notification color="warning">{error}</Notification>
                        )}
                        <div className="field">
                            <label className="label">Email</label>
                            <input
                                className="input"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label className="label">Username</label>
                            <input
                                className="input"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <input
                                className="input"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <footer className="card-footer">
                        <button
                            className="button is-primary card-footer-item"
                            type="submit"
                        >
                            Register
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;

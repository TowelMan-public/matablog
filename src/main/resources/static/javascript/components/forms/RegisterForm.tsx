import React, { useEffect, useRef, useState } from 'react';
import {
    Notification,
    Progress,
    Help,
    Card,
    Label,
    Input,
    Field,
    Button,
} from 'rbx';
import {
    faCheck,
    faFontAwesomeLogoFull,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

type FormData = {
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
};

export default () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [apiError, setApiError] = useState<string>('');
    const { register, setValue, handleSubmit, errors, watch } = useForm<
        FormData
    >({
        criteriaMode: 'all',
    });
    const password = useRef({});
    password.current = watch('password', '');

    const onSubmit = handleSubmit((data) => {
        // register(email,username, password).catch((loginError) => {
        //   setError(loginError);
        // });

        //CSRF Protection
        const elementToken = document.querySelector('meta[name="_csrf"]');
        const csrfToken = elementToken && elementToken.getAttribute('content');
        const elementHeader = document.querySelector(
            'meta[name="_csrf_header"]'
        );
        const csrfHeader =
            elementHeader && elementHeader.getAttribute('content');

        if (!csrfToken || !csrfHeader) {
            setApiError('Missing CSRF token. Unable to send request.');
            return;
        }
        setLoading(true);
        const url = '/api/user/registration';

        fetch(url, {
            method: 'post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken,
            },
            body: JSON.stringify({
                email: data.email,
                username: data.username,
                password: data.password,
            }),
        })
            .then((response) => {
                setLoading(false);
                if (response.ok) {
                    setApiError('');
                    window.location.href = '/registerSuccess';
                } else {
                    response.json().then((data: any) => {
                        setApiError(data.message);
                    });
                }
            })
            .catch((err) => {
                setLoading(false);
                setApiError('An network error has occurred.');
                console.log(err);
            });
    });

    return (
        <Card>
            <Card.Header>
                <Card.Header.Title>Register</Card.Header.Title>
            </Card.Header>

            <form onSubmit={onSubmit}>
                <Card.Content>
                    {loading && <Progress />}
                    {apiError && (
                        <Notification color="danger">{apiError}</Notification>
                    )}
                    <Field>
                        <Label>Email*</Label>
                        <input
                            className="input"
                            name="email"
                            maxLength={50}
                            ref={register({
                                required: 'You must specify an email',
                                maxLength: 50,
                            })}
                            type="email"
                        />
                        {errors.email && (
                            <Help color="danger">{errors.email.message}</Help>
                        )}
                    </Field>

                    <Field>
                        <Label>Username*</Label>
                        <input
                            className="input"
                            name="username"
                            maxLength={25}
                            ref={register({
                                required: 'You must specify a username',
                                maxLength: 25,
                            })}
                        />
                        {errors.username && (
                            <Help color="danger">
                                {errors.username.message}
                            </Help>
                        )}
                    </Field>

                    <Field>
                        <Label>Password*</Label>
                        <input
                            className="input"
                            name="password"
                            maxLength={25}
                            ref={register({
                                required: 'You must specify a password',
                                minLength: {
                                    value: 12,
                                    message:
                                        'Your password must have 12 characters.',
                                },
                                maxLength: 25,
                                validate: {
                                    hasNum: (value) =>
                                        new RegExp('(?=.*[0-9])').test(value) ||
                                        'Needs nums',
                                    hasLowercase: (value) =>
                                        new RegExp('(?=.*[a-z])').test(value) ||
                                        'Needs lowercase',
                                    hasUppercase: (value) =>
                                        new RegExp('(?=.*[A-Z])').test(value) ||
                                        'Needs uppercase',
                                },
                            })}
                        />
                        <Help>
                            Passwords must be:
                            <ul>
                                <li>At least 12 characters long</li>
                                <li>At least 1 alphabetical character</li>
                                <li>At least 1 number</li>
                                <li>At least 1 upper/lower case character</li>
                            </ul>
                        </Help>
                        {errors.password && (
                            <Help color="danger">
                                {errors.password.message}
                            </Help>
                        )}
                    </Field>

                    <Field>
                        <Label>Repeat Password*</Label>
                        <input
                            className="input"
                            name="passwordConfirm"
                            maxLength={25}
                            ref={register({
                                required: 'You must repeat your password',
                                maxLength: 25,
                                validate: (value) =>
                                    value === password.current ||
                                    'The passwords do not match',
                            })}
                            type="password"
                        />
                        {errors.passwordConfirm && (
                            <Help color="danger">
                                {errors.passwordConfirm.message}
                            </Help>
                        )}
                    </Field>
                </Card.Content>
                <Card.Footer>
                    <Button
                        className="card-footer-item"
                        color="primary"
                        type="submit"
                    >
                        Register
                    </Button>
                </Card.Footer>
            </form>
        </Card>
    );
};
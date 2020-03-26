import React, { useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { Formik, Form, useField, FieldArray, Field } from 'formik';
//import { Button } from 'reactstrap'
import axios from 'axios';

const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props);

    return ( 
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <input className='text-input' {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className='error'>{meta.error}</div>
            ) : null}
        </>
    );
};

const UpdateMovie = props => {
    // const [editMovie, setEditMovie] = useState({
    //     id: '',
    //     title: '',
    //     director: '',
    //     metascore: '',
    //     stars: []
    // });
    const { id } = useParams();
    const [toNext, setToNext] = useState(false);

    return (
        <div className='form-wrapper'>
            <h1>Update Movie</h1>
            <Formik
                initialValues={{
                    id: `${id}`,
                    title: props.title,
                    director: props.director,
                    metascore: props.metascore,
                    stars: [props.stars]
                }}
                onSubmit={values => {
                    console.log('Values', values);
                    axios
                        .put(`http://localhost:5000/api/movies/${id}`, values)
                        .then(res => {
                            console.log('POST response', res);
                            setToNext(true);
                        })
                        .catch(err => console.log(`Submit failure, ${err}`));
                }}
                render={({ errors, handleChange, touched, values }) => (
                    <Form>
                        {toNext ? <Redirect to={`/movies/${id}`} /> : null}
                        <TextInput
                            error={errors.title && touched.title}
                            label='Title'
                            name='title'
                            type='text'
                            onChange={handleChange}
                        />
                        <TextInput
                            error={errors.director && touched.director}
                            label='Director'
                            name='director'
                            type='text'
                            onChange={handleChange}
                        />
                        <TextInput
                            error={errors.metascore && touched.metascore}
                            label='Metascore'
                            name='metascore'
                            type='number'
                            onChange={handleChange}
                        />
                        <Form>
                            <FieldArray
                                name='stars'
                                render={arrayHelpers => (
                                    <div>
                                        {values.stars.map((index) => (
                                            <div key={index}>
                                                <Field
                                                    name={`stars[${index}]`}
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type='button'
                                            onClick={() =>
                                                arrayHelpers.push({})
                                            }>
                                            Add Star
                                        </button>
                                    </div>
                                )}
                            />
                        </Form>{' '}
                        <Button
                            type='submit'
                            variant='contained'
                            color='primary'>
                            Update
                        </Button>
                    </Form>
                )}
            />
        </div>
    );
};

export default UpdateMovie;
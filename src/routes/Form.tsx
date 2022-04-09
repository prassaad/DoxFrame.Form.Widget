import { h, Fragment } from 'preact';
import { useContext, useState, useMemo, useEffect } from 'preact/hooks';
import style from './form.css';
import { GetFormModel } from '../models';
import { ConfigContext, ServiceContext } from '../AppContext';
import Field from '../components/Field';
import { useIsMounted } from '../hooks';
import { RouteLink, RouterContext } from '../layout/Router';

const Form = () => {
    const config = useContext(ConfigContext);
    const service = useContext(ServiceContext);
    const router = useContext(RouterContext);
    const mounted = useIsMounted();

    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
	
	const [layout, setLayout] = useState([]);

    const [emailValue, setEmailValue] = useState('');
    const emailError = useMemo(
        () => mounted.current && (!emailValue || !(/^\S+@\S+$/.test(emailValue)))
            ? 'Email is required and must be valid' : '',
        [emailValue, submitting, mounted]);

    const [messageValue, setMessageValue] = useState('');
    const messageError = useMemo(
        () => mounted.current && (!messageValue || messageValue.length < 5)
            ? 'Text is required and must contain at least 5 characters' : '',
        [messageValue, submitting, mounted]);

    const formValid = useMemo(
        () => ![emailError, messageError].reduce((m, n) => m + n),
        [emailError, messageError]);
		
 	
	function renderForm(field_type){
		
		switch (field_type.ClientControl.ControlType) {
			case 'TextBox': 
			return (
				<>
				   <Field
						name={field_type.Name}
						title={field_type.Name}
						error={emailError}
						render={(inputProps) => (
							<input
								type='text'
								inputMode=''
								disabled={submitting}
								placeholder=''
								autoFocus
								onInput={(e) => setEmailValue(e.currentTarget.value)}
								{...inputProps}
							/>)} />
				</>
			  )
			case 'Email':
			return (
			<>
			 <Field
						name={field_type.Name}
						title={field_type.Name}
						error={emailError}
						render={(inputProps) => (
							<input
								type='text'
								inputMode='email'
								disabled={submitting}
								placeholder='me@home.com'
								autoFocus
								onInput={(e) => setEmailValue(e.currentTarget.value)}
								{...inputProps}
							/>)} />
			</>
			
			)
			case 'TextArea':
			return (
			<>
				 <Field
						name={field_type.Name}
						title={field_type.Name}
						error={messageError}
						render={(inputProps) => (
							<textarea
								rows={2}
								disabled={submitting}
								autoComplete='disable'
								onInput={(e) => setMessageValue(e.currentTarget.value)}
								{...inputProps}
							/>)} />
							
			</>
			
			)
			case 'DropDown': 
			return (
				<>
					  <label for={name}>{field_type.Name}  </label>	
					 <select>
					  <option value="A">Select an Option</option>
					  <option value="A">A</option>
					  <option value="B">B</option>
					  <option value="C">C</option>
					</select>
				</>
			  )  
			case 'Date':
			return (
				<>
				  <label for={name}>{field_type.Name}  </label>
				 <input type='date'></input>
				  
				</>
			  )
			case 'CheckBox':
			return (
			  <>
				<label class='form-check-label' for={field_type.Name}>{field_type.Name}</label>
				<input  type='checkbox'   />
				 
			  </>
			  )
			default:
			return null;
		}
	}
 
	  	 
    useEffect(() => {
		
	 
		 	
        if (!submitting) {
			service?.getForm()
            .then((response) => setLayout(response.ODataClientFilter.ClientFilterRows[0].ClientFilters))
            .catch(() => setServerError('Failed to load, try again later.'));

            return;
        }
        setServerError(''); // reset previous server error
        if (!formValid) {
            setSubmitting(false);
            return;
        }

		


        console.log('Sending form', { emailValue, messageValue });
        service?.sendForm({ email: emailValue, message: messageValue })
            .then(() => {
                router.setRoute('/');
            })
            .catch(() => {
                setServerError(`Something went wrong and we couldn't send your form. Please try again later.`);
            })
            .then(() => setSubmitting(false));
    }, [formValid, submitting, emailValue, messageValue, service]);
 
    return (
        <div>
				<Fragment></Fragment>
				{
					  layout.map((q, i) => (
						renderForm(q)	 
					 ))
					
				}
			 
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitting(true);
                }}>
                {serverError && <div className={style.error}>{serverError}</div>}
               
				
				 
                <div className={style.actions}>
                    <button type='submit' disabled={submitting || !formValid}>
                        {submitting ? 'Sending...' : 'Send'}
                    </button>
                </div>
            </form>
        </div >);
};

export default Form;

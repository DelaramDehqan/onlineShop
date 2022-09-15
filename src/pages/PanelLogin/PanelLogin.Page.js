import {PATHS} from 'configs/routes.config';
import {connect} from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom'
import {login} from 'redux/actions/user.action';
import {useNavigate} from 'react-router-dom';
import {useRef} from 'react';
import {toast} from 'react-toastify';
import styles from './login.module.scss'


const PanelLoginPage = props => {

    const formRef = useRef();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData(e.target);
        const data = Object.fromEntries(form);
        try {
            const response = await props.login(data);
            navigate(PATHS.PANEL_PRODUCT);
            console.log('submit: ', response);
        } catch (e) {

            toast.error('نام کاربری یا رمز عبور اشتباه است.', {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className:styles.errors,
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>صغحه ورود</title>
            </Helmet>
            <div className={styles.loginPage}>
                <div className={styles.userIcon}>
                    <FontAwesomeIcon style={{fontSize:'15rem' , color:'lightgray'}} icon={faUser} />
                </div>
                <form className={styles.mainForm} onSubmit={handleSubmit} ref={formRef}>
                    <h3 className={styles.headerLogin}>ورود به پنل مدیریت فروشگاه</h3>
                    <div className={styles.inputMargin}>
                        <label className={styles.loginLabels} htmlFor="username">نام کاربری</label>
                        <div>
                            <input className={styles.loginInput}  name="username"  id="username" type="text" placeholder="نام کاربری ..." />
                        </div>
                    </div>
                    <div className={styles.inputMargin}>
                        <label className={styles.loginLabels} htmlFor="password">رمز عبور</label>
                        <div>
                            <input className={styles.loginInput} name="password" id="password" type="password" placeholder="کلمه عبور ..." />
                        </div>
                    </div>

                    <button className={styles.button} type="submit">ورود</button>

                    <div className={styles.backHome}>
                        <Link to="/">
                            <div style={{color:'purple' , fontSize:'1.4rem'}}>
                                بازگشت به سایت
                            </div>
                        </Link>
                    </div>
                </form>
            </div>

        </>
    );
};

const mapDispatchToProps = dispatch => ({
    login: (data) => dispatch(login(data))
});

const PanelLogin = connect(undefined, mapDispatchToProps)(PanelLoginPage);

export {PanelLogin};

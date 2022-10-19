import classes from "./Spinner.module.scss";

const Spinner = ({isLoading, content}) =>{
    const spinnerPartStyle = { backgroundColor: 'var(--tea-green)' }
    return (isLoading?
            <div className={classes.spinnerContainer}>
                <div className={classes["loadingio-spinner-spinner-1pbw5j7hwri"]}>
                    <div className={classes["ldio-sxcqhxvxw8c"]}>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                        <div style={spinnerPartStyle}></div>
                    </div>
                </div>
            </div>:<>{content}</>
    )
}

export {Spinner};

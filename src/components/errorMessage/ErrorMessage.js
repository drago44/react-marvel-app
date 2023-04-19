import img from './error.gif';

const ErrorMessage = () => {
  return (
    <img style={{ display: 'flex',margin: '0 auto', background: 'none', width: '250px', height: '250px'}} src={img} alt="Error"/>
  )
}

export default ErrorMessage;
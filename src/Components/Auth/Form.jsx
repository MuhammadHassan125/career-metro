const Form = ({processing, onSubmit, children}) => {
  
    const handleSubmit= (e)=>{
        e.preventDefault();
        if(!processing && typeof onSubmit === 'function'){
            onSubmit(e);
        }
    }
  return (
    <form onSubmit={handleSubmit}>
        {children}
    </form>
  )
}

export default Form
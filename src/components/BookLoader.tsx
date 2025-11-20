import bookLoader from '../assets/images/book.png'

export const BookLoader = () => {
  return (
    <div className={`flex h-screen items-center justify-center`}>
      <div className='block'>

      <img src={bookLoader} width={100} height={100} />
      <h3 className='text-primary text-center font-bold'>Cargando...</h3>
      </div>
    </div>
  );
};

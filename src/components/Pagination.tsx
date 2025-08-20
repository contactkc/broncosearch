interface Props {
  totalPosts: number;
  postsPerPage: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
}

const Pagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }: Props) => {
  const pages = [];
  for (let i = 1; i <= Math.ceil(totalPosts/postsPerPage); i++){
    pages.push(i)
  }
  return (
    <div className="flex justify-center mt-2 w-fit mx-auto">
      {
        pages.map((page, index)=> {
          return <button 
            className={`text-md p-2 mx-1 rounded-lg ${page == currentPage 
                ? "font-bold text-white cursor-normal" 
                : "text-neutral-400 cursor-pointer"}`} 
            key={index} 
            onClick={()=>setCurrentPage(page)}>
                {page}
            </button>
        })
      }
    </div>
  )
  
};

export default Pagination;
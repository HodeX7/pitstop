import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const Search = () => {
    return (
        <div className="z-1">
            <div className="flex items-center justify-between mb-3">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Search"
                    className="outline-none bg-gray-100 p-3 rounded-lg w-3/4"
                />
                <SearchOutlinedIcon className="cursor-pointer" />
                <FilterListOutlinedIcon className="cursor-pointer" />
            </div>
        </div>
    )
}

export default Search
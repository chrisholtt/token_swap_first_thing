import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function TokenModal({ tokenOpen, handleTokenModal, tokens, handleTokenFromChange }) {

    const handleClose = () => {
        handleTokenModal();
    }


    const handleTokenChange = (tokenAdd) => {
        const tokenFromSearch = tokens.filter(token => token.address == tokenAdd)
        handleTokenFromChange(tokenFromSearch[0])
        console.log(tokens);
        console.log(tokenFromSearch[0]);
        handleTokenModal();
    }

    const [tokenSearch, setTokenSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const handleTokenSearch = (e) => {
        const { value } = e.target;
        setTokenSearch(value);
    }

    useEffect(() => {
        setSearchResult(searchForTokens(tokenSearch));
    }, [tokenSearch])

    const searchForTokens = (ticker) => {
        let results = [];
        ticker = ticker.toUpperCase();
        results = tokens.filter((token) => token.symbol.includes(ticker))
        return results
    }




    const tokenNodes = tokens.map((token, index) => {
        return (
            <div className='token' key={index} onClick={() => handleTokenChange(token.address)}>
                <img src={token.logoURI} alt="" />
                <h3>{token.name}</h3>
                <h3>{token.symbol}</h3>
            </div>
        )
    })

    const searchResults = searchResult.map((token, index) => {
        return (
            <div className='token' key={index} onClick={() => handleTokenChange(token.address)}>
                <img src={token.logoURI} alt="" />
                <h3>{token.name}</h3>
                <h3>{token.symbol}</h3>
            </div>
        )
    })




    return (
        <div>
            <Modal
                open={tokenOpen}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <button onClick={handleClose}>close</button>
                    <input type="text" placeholder='search ticker' value={tokenSearch} onChange={handleTokenSearch} />
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Select a token
                    </Typography>

                    <div className='token-nodes'>
                        {tokenSearch ?
                            searchResults :
                            tokenNodes
                        }
                    </div>



                </Box>
            </Modal>
        </div>
    );
}

export default TokenModal;

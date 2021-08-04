// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    constructor() ERC721("StarToken", "STR") {}

    // Star data
    struct Star {
        string name;
        string color;
        uint256 price;
    }

    // mapping the Star with the TokeId
    mapping(uint256 => Star) public tokenIdToStarInfo;

    // mapping the Owner Address with its stars
    // Project increment
    mapping(address => Star[]) public starsByOwner;

    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSalePrice;

    Star[] public starsForSale;

    // Create Star using the Struct
    function createStar(string memory _name, string memory _color, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name, _color, 0); // Star is an struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping

        // Project increment
        starsByOwner[msg.sender].push(newStar);

        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSalePrice
    // first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price, uint _index) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
        require(_price > 0, "Price can't be ZERO");
        starsForSalePrice[_tokenId] = _price;
        starsForSale.push(starsByOwner[msg.sender][_index]);
    }

    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return payable (address(uint160(x)));
    }

    function buyStar(uint256 _tokenId, uint _index) public  payable {
        require(starsForSalePrice[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSalePrice[_tokenId];
        address ownerAddress = ownerOf(_tokenId);

        require(msg.value > starCost, "You need to have enough Ether");

        _transfer(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers

        ownerAddressPayable.transfer(starCost);

        if(msg.value > starCost) {
            payable (msg.sender).transfer(msg.value - starCost);
        }

        _removeStarFromStarsForSaleAfterBuy(_index);
        _removeStarFromStarsByOwnerAfterPutToSell(_index, ownerAddress);

        starsByOwner[msg.sender].push(tokenIdToStarInfo[_tokenId]);
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (Star memory) {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        return tokenIdToStarInfo[_tokenId];
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2, uint _index) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        require(msg.sender == ownerOf(_tokenId1) || msg.sender == ownerOf(_tokenId2), "A user only can exchange your own stars");
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId1)
        address user1 = ownerOf(_tokenId1);
        address user2 = ownerOf(_tokenId2);
        //4. Use _transferFrom function to exchange the tokens.
        _transfer(user1, user2, _tokenId1);
        _transfer(user2, user1, _tokenId2);

        uint star2Index;

        for(uint i=0; i < starsByOwner[user2].length - 1 ; i++){
          if(keccak256(bytes(starsByOwner[user2][i].name)) == keccak256(bytes(tokenIdToStarInfo[_tokenId2].name)) &&
            keccak256(bytes(starsByOwner[user2][i].color)) == keccak256(bytes(tokenIdToStarInfo[_tokenId2].color))){
              star2Index = i;
          }
        }
        _removeStarFromStarsByOwnerAfterPutToSell(_index, user1);
        _removeStarFromStarsByOwnerAfterPutToSell(star2Index, user2);

        starsByOwner[user1].push(tokenIdToStarInfo[_tokenId2]);
        starsByOwner[user2].push(tokenIdToStarInfo[_tokenId1]);

        _removeStarFromStarsForSaleAfterBuy(star2Index);
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId, uint _index) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        require(msg.sender == ownerOf(_tokenId), "You can't transfer the Star you don't owned");
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        _transfer(msg.sender, _to1, _tokenId);

        starsByOwner[msg.sender][_index] = starsByOwner[msg.sender][starsByOwner[msg.sender].length - 1];
        starsByOwner[msg.sender].pop();

        starsByOwner[_to1].push(tokenIdToStarInfo[_tokenId]);
    }

    function getStarsByOwner() public view returns (Star [] memory){
        return starsByOwner[msg.sender];
    }

    function _removeStarFromStarsByOwnerAfterPutToSell(uint _index, address ownerAddress) internal {
      starsByOwner[ownerAddress][_index] = starsByOwner[ownerAddress][starsByOwner[ownerAddress].length - 1];
      starsByOwner[ownerAddress].pop();
    }

    function _removeStarFromStarsForSaleAfterBuy(uint _index) internal {
      starsForSale[_index] = starsForSale[starsForSale.length - 1];
      starsForSale.pop();
    }

    function getStarsForSale() public view returns (Star [] memory){
        return starsForSale;
    }

}

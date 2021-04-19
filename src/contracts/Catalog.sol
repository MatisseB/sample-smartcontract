pragma solidity <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


contract Catalog is ERC721 {
    // Owner vars
    uint public __commissionPt;
    address private __owner;

    // Counters
    uint256 public __estateCounter;

    // Mappings
    mapping (uint256 => Estate) public __estates;
    mapping (uint256 => uint256) public __estatesForSale;
    mapping(string => bool) public __addressExists;
    mapping(address => uint256[]) public __ownerEstates;

    // Estate Struct
    struct Estate {
        // Mandatory
        string name;
        string postal;
        string description;
        //  Optional
        string[] gallery;
    }

    constructor() ERC721("catalog", "CATALOG") {
        __owner = msg.sender;
        __commissionPt=1000;
        __estateCounter=0;
    }

    event estateAdded(address _owner, uint _id);
    event transactionEmitted(address indexed _from, address indexed _to, uint _id);

    function registerEstate(bool _available, string memory _name, uint256 _price, string memory _postal, string memory _description, string[] memory _gallery) public {
        // Estate must be unique
        require(!__addressExists[_postal], "An estate token with this address is already defined");
        
        // Init estate
        Estate memory newEstate = Estate(_name, _postal, _description, _gallery);

        // Setup
        __estates[__estateCounter] = newEstate;
        if (_available) {
            __estatesForSale[__estateCounter] = _price;
        }
        __addressExists[_postal] = true;
        __ownerEstates[msg.sender].push(__estateCounter);
        _mint(msg.sender, __estateCounter);
        emit estateAdded(msg.sender, __estateCounter++);

    }

    function putEstateForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender, "This estate is not yours");
        require(_price>0, "This estate is not yours");
        __estatesForSale[_tokenId] = _price;
    }
    
    function isOwnerContract() public view returns (address) {
        return __owner;
    }

    function retrieveCommission(uint _commission) public returns (bool) {
        require(msg.sender==__owner, "You're not the owner of this contract");
        (bool success, ) = msg.sender.call{value: _commission}("");
        return success;
    }
    
    function getCommissionPt() public view returns (uint) {
        return __commissionPt;
    }

    function removeEstateFromSale(uint256 _tokenId) public {
        require(this.ownerOf(_tokenId) == msg.sender, "This estate is not yours");
        __estatesForSale[_tokenId] = 0;
    }

    function setCommissionPt(uint256 _value) public {
        require(msg.sender==__owner, "You must own the contract to do that");
        __commissionPt=_value*100;
    }

    function getOwnerNb(address _owner) public view returns (uint256[] memory) {
        return __ownerEstates[_owner];
    }

    function getEstate(uint256 _tokenId) public view returns (string memory, string memory, string memory, string[] memory){
        require(_exists(_tokenId), "This estate does not exists");
        return (
            __estates[_tokenId].name,
            __estates[_tokenId].postal,
            __estates[_tokenId].description,
            __estates[_tokenId].gallery
        );
    }

    function buyEstate(uint256 _tokenId) public payable returns (bool){
        // Check if Estate is sallable
        require(_exists(_tokenId), "This estate does not exists");
        require(__estatesForSale[_tokenId]>0, "This estate is not for sale");

        // Retrieve Estate price and check wether the request amount is sufficient.
        uint256 estatePrice = __estatesForSale[_tokenId];
        address payable ownerOfEstate = address(uint160(ownerOf(_tokenId)));
        require(msg.value>=estatePrice, "You need to provide more ETH to buy this estate");
        
        // Make the transaction
        uint256 commission = estatePrice * __commissionPt / 10000;
        (bool success, ) = ownerOfEstate.call{value: estatePrice-commission}("");
        // Manage transfert
        _burn(_tokenId);
        _mint(msg.sender, _tokenId);
        delete __ownerEstates[ownerOfEstate][_tokenId];
        __ownerEstates[msg.sender].push(_tokenId);
        // Return balance overage to buyer
        if (msg.value > estatePrice) {
            msg.sender.transfer(msg.value-estatePrice);
        }
        emit transactionEmitted(msg.sender, ownerOfEstate, _tokenId);
        return success;
    }
}
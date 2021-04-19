pragma solidity >0.7.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Course is ERC721 {
    // Vars
    address public professor;
    uint256 public nbStudents;
    string public title;


    // Counters
    uint256 public studentCounter;

    // Mappings
    address[] public students;
    mapping(address => Student) public __students;
    mapping(address => bool) public __studentExists;

    // Student Struct
    struct Student {
        // Mandatory
        address id;
        string name;
        int grade;

        // Optional
        string comment;
    }


    constructor() ERC721("course", "COURSE") {
        professor = msg.sender;
        nbStudents = 0;
        studentCounter = 0;
        title = "Mathematiques";
    }

    modifier onlyBy(address _account)
    {
        require(
            msg.sender == _account,
            "Sender not authorized."
        );
        _;
    }

    event studentAdded(address professor, address student, uint256 timestamp);
    event studentAssessed(address professor, address student, uint256 timestamp);

    function registerStudent(address _studentId, string memory _name) public onlyBy(professor) {
        // Student must be unique
        require(!__studentExists[_studentId], "This student is already registered in this course");

        // Init student 
        Student memory newStudent = Student(_studentId, _name, -1, "");

        // Setup
        __students[_studentId] = newStudent;
        __studentExists[_studentId] = true;
        students.push(_studentId);
        _mint(msg.sender, studentCounter++);
        emit studentAdded(msg.sender, _studentId, block.timestamp);
    }

    function assessStudent(address _studentId, int _grade, string memory _comment) public onlyBy(professor) {
        __students[_studentId].grade = _grade;
        __students[_studentId].comment = _comment;
        emit studentAssessed(msg.sender, _studentId, block.timestamp);
    }

    function getGrade(address _studentId) public view returns(string memory, int, string memory) {
        require(msg.sender == _studentId || msg.sender == professor, "You're not authorized to get this information");
        return (
            __students[_studentId].name,
            __students[_studentId].grade,
            __students[_studentId].comment
        );
    }

    function getProfessor() public view returns (address) {
        return professor;
    }
}
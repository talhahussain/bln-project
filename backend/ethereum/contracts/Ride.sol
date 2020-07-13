pragma solidity 0.4.17;

contract RideFactory {
    
    address[] public deployedRide;
    address public newDeployedRide;
    
    function createRide(address driver, string start, string end, uint distance) public {
        
        address newRide = new Ride(msg.sender, driver, start, end, distance);
        deployedRide.push(newRide);
        newDeployedRide = newRide;
        
    }
    
    function getDeployedRide() public view returns (address[]){
        return deployedRide;
    }
}

contract Ride {
    
    address public manager;
    
    address public driver;
    address public passenger;
    uint public fare;
    uint public distance;
    bool public isCompleted;
    bool public isSatisfactory;
    string public startPoint;
    string public endPoint;
    
    
    function Ride(address creator, address dri, string start, string end, uint d) public {
        
        manager = creator;
        distance = d;
        driver = dri;
        passenger = msg.sender;
        isCompleted = false;
        isSatisfactory = false;
        startPoint = start;
        endPoint = end;
        
    }
    function calculateFare() public payable{
        
        fare = msg.value;
        
    }
    
    function getRideDetails() public view returns (address, address, uint, uint, string, string, bool, bool) {
        
        return(

            driver,
            passenger,
            fare,
            distance,
            startPoint,
            endPoint,
            isCompleted,
            isSatisfactory
        );
    }
    function completeRide(bool com, bool sat) public payable {
        
        require(msg.sender == driver || msg.sender == manager );
        isCompleted = com;
        isSatisfactory = sat;
        if( com && sat){
            driver.transfer(this.balance);
        }
    }
    
    function transferMoney(string t) public payable{
        
        require(msg.sender == passenger || msg.sender == manager);
        
        if(keccak256(t) == keccak256('driver')){
            
            driver.transfer(this.balance);
        }
        else{
            
            passenger.transfer(this.balance);
        }
        isCompleted = true;
    }
    
}

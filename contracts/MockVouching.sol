pragma solidity ^0.4.24;

import "./ZepToken.sol";
import "openzeppelin-eth/contracts/ownership/Ownable.sol";

contract MockVouching is Ownable {
  event Vouched(uint256 indexed id, address indexed sender, uint256 amount);
  event Unvouched(uint256 indexed id, address indexed sender, uint256 amount);
  event Registered(uint256 indexed id, address indexed vouched, address owner, uint256 amount, string metadataURI, bytes32 metadataHash);
  event Challenged(uint256 indexed id, uint256 indexed challengeId, address indexed challenger, uint256 amount, string challengeURI, bytes32 challengeHash);

  struct Entry {
    uint256 id;
    address vouched;
    address owner;
    uint256 totalAmount;
    string metadataURI;
    bytes32 metadataHash;
  }

  struct Challenge {
    uint256 id;
    uint256 entryId;
    address challenger;
    uint256 amount;
    string metadataURI;
    bytes32 metadataHash;
    // TODO: store state
  }

  ZepToken private _token;
  Entry[] private _entries;
  Challenge[] private _challenges;
  uint256 private _minimumStake;

  // entry id => voucher => amount
  mapping (uint256 => mapping (address => uint256)) private _vouchedAmounts;

  // entry id => challenger => amount
  mapping (uint256 => mapping (address => uint256)) private _challengedAmounts;

  /**
   * @dev Initializer function. Called only once when a proxy for the contract is created.
   * @param minimumStake uint256 that defines the minimum initial amount of vouched tokens a dependency can have when being created.
   * @param token ZepToken token to be used for vouching on dependencies.
   */
  function initialize(uint256 minimumStake, ZepToken token) initializer public {
    _minimumStake = minimumStake;
    _token = token;
  }

  /**
   * @dev Tells the address of an entry
   */
  function vouched(uint256 id) public view returns (address) {
    return exists(id) ? _entries[id].vouched : address(0);
  }

  /**
   * @dev Tells the owner of an entry
   */
  function owner(uint256 id) public view returns (address) {
  }

  /**
   * @dev Tells the total amount vouched for an entry
   */
  function totalVouched(uint256 id) public view returns (uint256) {
  }

  /**
   * @dev Tells the amount vouched for entry by a given voucher
   */
  function vouched(uint256 id, address voucher) public view returns (uint256) {
  }

  /**
   * @dev Tells the challenger of a challenge
   */
  function challenger(uint256 challengeId) public view returns (address) {
  }

  /**
   * @dev Tells the entry being challenged
   */
  function challengeTarget(uint256 challengeId) public view returns (uint256) {
  }

  /**
   * @dev Tells the amount vouched for a challenge
   */
  function challengeStake(uint256 challengeID) public view returns (uint256) {
  }

  /**
   * @dev Tells the metadata associated with a challenge
   */
  function challengeMetadata(uint256 challengeID) public view returns (string, bytes32) {
  }

  /**
   * @dev Tells the state of a challenge
   */
  function challengeState(uint256 challengeID) public {
  }

  /**
   * @dev Generates a fresh ID and adds a new `vouched` item to the vouching contract, owned by the sender, with `amount`
   * initial ZEP tokens sent by the sender. Requires vouching at least `minStake` tokens, which is a constant value.
   */
  function register(address _vouched, uint256 amount, string metadataURI, bytes32 metadataHash) public {
    require(_vouched != address(0), "Dependency address cannot be zero");
    // require(amount >= _minimumStake, "Initial vouched amount must be equal to or greater than the minimum stake");

    uint256 id = _entries.length;
    Entry memory entry = Entry(id, _vouched, msg.sender, amount, metadataURI, metadataHash);
    _entries.push(entry);
    _vouchedAmounts[id][msg.sender] = amount;
    emit Registered(id, _vouched, msg.sender, amount, metadataURI, metadataHash);

    _token.transferFrom(msg.sender, this, amount);
  }

  /**
   * @dev Increases the vouch for the package identified by `id` by `amount` for `sender`.
   */
  function vouch(uint256 id, uint256 amount) public {
  }

  /**
   * @dev Decreases the vouch for the package identified by `id` by `amount` for `sender`. Note that if `sender` is the
   * `vouched` owner, he cannot decrease his vouching under `minStake`.
   */
  function unvouch(uint256 id, uint256 amount) public {
  }

  /**
   * @dev Creates a new challenge with a fresh id in a _pending_ state towards a package for an `amount` of tokens,
   * where the details of the challenge are in the URI specified.
   */
  function challenge(uint256 id, uint256 amount, string metadataURI, bytes32 metadataHash) public {
  }

  /**
   * @dev Accepts a challenge. Can only be called by the owner of the challenged item.
   */
  function accept(uint256 challengeId) public {
  }

  /**
   * @dev Rejects a challenge. Can only be called by the owner of the challenged item.
   */
  function reject(uint256 challengeId) public {
  }

  /**
   * @dev Appeals a decision by the vouched item owner to accept or reject a decision. Any ZEP token holder can perform
   * an appeal, staking a certain amount of tokens on it. Note that `amount` may be fixed and depend on the challenge
   * stake, in that case, the second parameter can be removed.
   */
  function appeal(uint256 challengeId, uint256 amount) public {
  }

  /**
   * @dev Accepts an appeal on a challenge. Can only be called by an overseer address set in the contract, which will
   * be eventually replaced by a voting system.
   */
  function sustain(uint256 challengeId) public {
  }

  /**
   * @dev Rejects an appeal on a challenge. Can only be called by an overseer address set in the contract, which will
   * be eventually replaced by a voting system.
   */
  function overrule(uint256 challengeId) public {
  }

  /**
   * @dev Confirms the result of a challenge if it has not been challenged and the challenge period has passed.
   * Transfers tokens associated to the challenge as needed.
   */
  function confirm(uint256 challengeId) public {
  }

  /**
   * @dev Tells whether an entry is registered or not
   */
  function exists(uint256 id) internal returns (bool) {
    return id < _entries.length;
  }

  /**
   * @dev Tells whether a challenge exists or not
   */
  function existsChallenge(uint256 challengeId) internal returns (bool) {
  }
}

const slotMachine = [
  {
    constant: false,
    inputs: [
      {
        name: '_amountMANA',
        type: 'uint256'
      }
    ],
    name: 'addFunds',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'pause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_amountBet',
        type: 'uint256'
      },
      {
        name: '_machineID',
        type: 'uint256'
      },
      {
        name: '_localhash',
        type: 'uint256'
      }
    ],
    name: 'play',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_amountBet',
        type: 'uint256'
      }
    ],
    name: 'setAmounts',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newCEO',
        type: 'address'
      }
    ],
    name: 'setCEO',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newDev',
        type: 'address'
      }
    ],
    name: 'setDev',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'withdrawFunds',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_number',
        type: 'uint256'
      },
      {
        indexed: true,
        name: '_machineID',
        type: 'uint256'
      },
      {
        indexed: true,
        name: '_amountWin',
        type: 'uint256'
      }
    ],
    name: 'SpinResult',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_balance',
        type: 'uint256'
      }
    ],
    name: 'NewBalance',
    type: 'event'
  },
  {
    constant: true,
    inputs: [],
    name: 'amountBet',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'amountWin',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'ceoAddress',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'devAddress',
    outputs: [
      {
        name: '',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'funds',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'jackpot1',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'jackpot2',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'jackpot3',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'jackpot4',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'numbers',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'paused',
    outputs: [
      {
        name: '',
        type: 'bool'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'winner',
    outputs: [
      {
        name: '',
        type: 'uint256'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  }
];

export default slotMachine;

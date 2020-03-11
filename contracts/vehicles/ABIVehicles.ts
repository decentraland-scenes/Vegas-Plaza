const vehicles = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '_name',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
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
    constant: false,
    inputs: [
      {
        name: '_startingPrice',
        type: 'uint256'
      }
    ],
    name: 'setStartingPrice',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'implementsERC721',
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
    name: 'getAllOwners',
    outputs: [
      {
        name: '',
        type: 'address[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
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
    constant: false,
    inputs: [
      {
        name: '_newState',
        type: 'bool'
      },
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'startOrStopSelling',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_from',
        type: 'address'
      },
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
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
    inputs: [],
    name: 'unpause',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [],
    name: 'baseURL',
    outputs: [
      {
        name: '',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_baseURL',
        type: 'string'
      }
    ],
    name: 'setBaseURL',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
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
    constant: false,
    inputs: [
      {
        name: '_vanity',
        type: 'string'
      },
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'setVanity',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'ownerOf',
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
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
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
    constant: false,
    inputs: [],
    name: 'enableERC721',
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
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '_symbol',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address'
      }
    ],
    name: 'vehiclesOf',
    outputs: [
      {
        name: '',
        type: 'uint256[]'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_number',
        type: 'uint64'
      },
      {
        name: '_category',
        type: 'uint64'
      },
      {
        name: '_year',
        type: 'uint64'
      },
      {
        name: '_color',
        type: 'string'
      },
      {
        name: '_make',
        type: 'string'
      },
      {
        name: '_model',
        type: 'string'
      },
      {
        name: '_permit',
        type: 'string'
      }
    ],
    name: 'createVehicles',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address'
      },
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'transfer',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'takeOwnership',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'priceOf',
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
    name: 'contractFunds',
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
    inputs: [
      {
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenURI',
    outputs: [
      {
        name: '_tokenURI',
        type: 'string'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_vanity',
        type: 'string'
      }
    ],
    name: 'getLicense',
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
    name: 'startingPrice',
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
    constant: false,
    inputs: [
      {
        name: '_amount',
        type: 'uint256'
      }
    ],
    name: 'withdrawBalance',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: true,
    inputs: [
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'getVehicle',
    outputs: [
      {
        name: '_category',
        type: 'uint64'
      },
      {
        name: '_year',
        type: 'uint64'
      },
      {
        name: '_vanity',
        type: 'string'
      },
      {
        name: '_color',
        type: 'string'
      },
      {
        name: '_make',
        type: 'string'
      },
      {
        name: '_model',
        type: 'string'
      },
      {
        name: '_permit',
        type: 'string'
      },
      {
        name: '_price',
        type: 'uint256'
      },
      {
        name: '_forSale',
        type: 'bool'
      },
      {
        name: '_owner',
        type: 'address'
      }
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_newPrice',
        type: 'uint256'
      },
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'setNewPrice',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    constant: false,
    inputs: [
      {
        name: '_license',
        type: 'uint256'
      }
    ],
    name: 'purchase',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'number',
        type: 'uint64'
      },
      {
        indexed: true,
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'VehiclesCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'vanity',
        type: 'string'
      },
      {
        indexed: true,
        name: 'license',
        type: 'uint256'
      }
    ],
    name: 'Vanity',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'license',
        type: 'uint256'
      },
      {
        indexed: true,
        name: 'oldOwner',
        type: 'address'
      },
      {
        indexed: true,
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'VehicleSold',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newPrice',
        type: 'uint256'
      },
      {
        indexed: true,
        name: 'license',
        type: 'uint256'
      }
    ],
    name: 'SetPrice',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'newState',
        type: 'bool'
      },
      {
        indexed: true,
        name: 'license',
        type: 'uint256'
      }
    ],
    name: 'Selling',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        name: '_to',
        type: 'address'
      },
      {
        indexed: false,
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: '_owner',
        type: 'address'
      },
      {
        indexed: true,
        name: '_approved',
        type: 'address'
      },
      {
        indexed: false,
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  }
];

export default vehicles;

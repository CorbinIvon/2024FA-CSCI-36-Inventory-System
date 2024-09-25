// Mock API function to return dummy data
export const getLocations = async () => {
  return {
    locations: [
      {
        id: '1',
        name: 'House 1',
        children: [
          {
            id: '2',
            name: 'Bedroom 1',
            children: [
              {
                id: '3',
                name: 'Desk 1',
                children: [
                  {
                    id: '4',
                    name: 'Drawer 3',
                    children: [
                      {
                        id: '5',
                        name: 'File 5',
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: '6',
        name: 'House 2',
        children: [
          {
            id: '7',
            name: 'Living Room',
            children: [],
          },
        ],
      },
    ],
  };
};

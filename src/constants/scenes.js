export const sceneList = [
  {
    id: "001",
    success: true,
    image: "A scary back alley",
    text: ["First text string", "second text string"],
    decisions: [
      {
        label: "First Choice",
        child: "002"
      },
      {
        label: "Second Choice",
        child: "003"
      }
    ]
  },
  {
    id: "002",
    image: "A spoopy house",
    text: [
      "This house is very spoopy",
      "spoopy indeed"
    ],
    decisions: [
      {
        label: "initScene",
        child: "001"
      },
      {
        label: "spookBar",
        child: "003"
      }
    ]
  },
  {
    id: "003",
    image: "A haunted karaoke bar",
    text: [
      "All the ghosts get on stage to sing",
      "The skeletons, not so much"
    ],
    decisions: [
      {
        label: "initScene",
        child: "001"
      },
      {
        label: "spookHouse",
        child: "002"
      }
    ]
  }
]

type TType = '' | 'person' | 'wall' | 'contents' | 'other';

interface IModelDataChild {
  type: TType;
  path: string;
  param: { [key: string]: any };
}

interface IModelData {
  [key: string]: IModelDataChild;
}

const parentPath = 'model';

// =================================================
// CUBE
// =================================================

const path = 'envmap/';
const format = '.jpg';

export const cubeUrls: string[] = [
  `${path}px${format}`,
  `${path}nx${format}`,
  `${path}py${format}`,
  `${path}ny${format}`,
  `${path}pz${format}`,
  `${path}nz${format}`
];

// =================================================
// MODEL
// =================================================

export const boxData: IModelDataChild = {
  type: 'other',
  path: `${parentPath}/art-object.png`,
  param: {
    color: 0xffffff,
    envMapIntensity: 1,
    roughness: 0.2,
    metalness: 0
  }
};

export const modelData: IModelData = {
  looftop: {
    type: 'other',
    path: `${parentPath}/looftop.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  floor: {
    type: 'other',
    path: `${parentPath}/floor.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  wall1: {
    type: 'wall',
    path: `${parentPath}/wall_1.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  wall2: {
    type: 'wall',
    path: `${parentPath}/wall_2.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  wall3: {
    type: 'wall',
    path: `${parentPath}/wall_3.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  wall4: {
    type: 'wall',
    path: `${parentPath}/wall_4.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  person1: {
    type: 'person',
    path: `${parentPath}/01_person.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  person2: {
    type: 'person',
    path: `${parentPath}/02_person.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  person3: {
    type: 'person',
    path: `${parentPath}/03_person.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  person5: {
    type: 'person',
    path: `${parentPath}/05_person.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  person6: {
    type: 'person',
    path: `${parentPath}/06_person.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  person7: {
    type: 'person',
    path: `${parentPath}/07_person.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  person8: {
    type: 'person',
    path: `${parentPath}/08_person.png`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  contents1: {
    type: 'contents',
    path: `${parentPath}/c01-message-visualize.jpg`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  contents2: {
    type: 'contents',
    path: `${parentPath}/c02-live-stamp-action.jpg`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  contents3: {
    type: 'contents',
    path: `${parentPath}/c03-movie-sync-ar.jpg`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  contents4: {
    type: 'contents',
    path: `${parentPath}/c04-sound-experience.jpg`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  contents5: {
    type: 'contents',
    path: `${parentPath}/c05-sports-telepresence.jpg`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  contents6: {
    type: 'contents',
    path: `${parentPath}/c06-face-analysing.jpg`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  contents7: {
    type: 'contents',
    path: `${parentPath}/c07-voice-ai.jpg`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  contents8: {
    type: 'contents',
    path: `${parentPath}/c08-web-branding.jpg`,
    param: {
      color: 0xffffff,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  },
  panelWhite: {
    type: '',
    path: '',
    param: {
      color: 0xaaaaaa,
      reflectivity: 0.1,
      shininess: 5,
      specular: 0x333333
    }
  }
};

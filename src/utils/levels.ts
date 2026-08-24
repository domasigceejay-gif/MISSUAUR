import { LevelConfig } from '../types';

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    levelNumber: 1,
    name: 'ASHEN CRATER',
    themeColor: '#ff9800',
    skyColorTop: '#050000',
    skyColorBottom: '#4a1010',
    mountainColor: '#1a0a0a',
    groundColor: '#0a0505',
    lavaColor: '#ff4d00',
    targetDistance: 500, // 500 meters to reach portal
    baseSpeed: 340,
    volcanoSpawnRate: 0.7,
    meteorSpawnRate: 0.9,
    enemyDinoTypes: [],
    enemySpawnRate: 0,
    description: 'Jump over erupting volcanoes and unleash your fire breath to blast falling meteors!',
  },
  {
    levelNumber: 2,
    name: 'PTEROSAUR PEAKS',
    themeColor: '#e040fb',
    skyColorTop: '#020005',
    skyColorBottom: '#2a0535',
    mountainColor: '#100215',
    groundColor: '#0a010a',
    lavaColor: '#cc00ff',
    targetDistance: 650,
    baseSpeed: 400,
    volcanoSpawnRate: 0.8,
    meteorSpawnRate: 1.1,
    enemyDinoTypes: ['PTERODACTYL'],
    enemySpawnRate: 0.7,
    description: 'Dino speed increased! Airborne Pterosaurs patrol the ash-filled skies. Blast them or duck!',
  },
  {
    levelNumber: 3,
    name: 'RAPTOR CANYON',
    themeColor: '#ff1744',
    skyColorTop: '#050000',
    skyColorBottom: '#4a0505',
    mountainColor: '#1a0202',
    groundColor: '#0a0101',
    lavaColor: '#ff2200',
    targetDistance: 800,
    baseSpeed: 460,
    volcanoSpawnRate: 0.9,
    meteorSpawnRate: 1.3,
    enemyDinoTypes: ['PTERODACTYL', 'RAPTOR'],
    enemySpawnRate: 0.9,
    description: 'High velocity! Agile Velociraptors charge across magma pits alongside descending meteors.',
  },
  {
    levelNumber: 4,
    name: 'BASALT FORTRESS',
    themeColor: '#00e676',
    skyColorTop: '#000502',
    skyColorBottom: '#054a22',
    mountainColor: '#021a0a',
    groundColor: '#010a05',
    lavaColor: '#00ff66',
    targetDistance: 1000,
    baseSpeed: 520,
    volcanoSpawnRate: 1.0,
    meteorSpawnRate: 1.5,
    enemyDinoTypes: ['RAPTOR', 'ARMORED_TRICERATOPS'],
    enemySpawnRate: 1.1,
    description: 'Armored Triceratops with heavy skull shields block the path. Blast them multiple times with fire!',
  },
  {
    levelNumber: 5,
    name: "TITAN'S EXTINCTION RIFT",
    themeColor: '#ffd600',
    skyColorTop: '#050300',
    skyColorBottom: '#4a2500',
    mountainColor: '#1a0d00',
    groundColor: '#0a0500',
    lavaColor: '#ffbc00',
    targetDistance: 1200,
    baseSpeed: 580,
    volcanoSpawnRate: 1.2,
    meteorSpawnRate: 1.8,
    enemyDinoTypes: ['PTERODACTYL', 'RAPTOR', 'ARMORED_TRICERATOPS', 'T_REX_MINI'],
    enemySpawnRate: 1.4,
    description: 'The ultimate cataclysm! Rival T-Rex predators and meteor swarms barrage the final dimensional portal!',
  },
];

export function getLevelConfig(levelNumber: number): LevelConfig {
  if (levelNumber <= LEVEL_CONFIGS.length) {
    return LEVEL_CONFIGS[levelNumber - 1];
  }
  // Generate dynamically scaled infinite loop levels
  const base = LEVEL_CONFIGS[LEVEL_CONFIGS.length - 1];
  const excess = levelNumber - LEVEL_CONFIGS.length;
  return {
    ...base,
    levelNumber,
    name: `HYPER INFERNO ZONE ${excess}`,
    baseSpeed: base.baseSpeed + excess * 30,
    targetDistance: base.targetDistance + excess * 250,
    meteorSpawnRate: base.meteorSpawnRate + excess * 0.2,
    enemySpawnRate: base.enemySpawnRate + excess * 0.2,
  };
}

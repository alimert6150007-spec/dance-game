/* ============================================
   SONGS DATABASE
   JSON-based note maps for each song
   ============================================ */

const SONGS = [
    {
        id: 'boom_bap',
        name: 'Old School Boom Bap',
        icon: '🎤',
        description: 'Hızlı ve Ritmik - 90s Hip Hop',
        bpm: 110,
        // Pre-composed note map: { time (in beats), lane: 0=left, 1=down, 2=up, 3=right }
        notes: [
            // Intro (warm up)
            {time: 2, lane: 2}, {time: 4, lane: 1},
            {time: 6, lane: 0}, {time: 8, lane: 3},
            // Verse 1
            {time: 10, lane: 0}, {time: 11, lane: 2},
            {time: 12, lane: 1}, {time: 13, lane: 3},
            {time: 14, lane: 0}, {time: 14, lane: 3},
            {time: 16, lane: 2}, {time: 17, lane: 1},
            {time: 18, lane: 0}, {time: 19, lane: 3},
            {time: 20, lane: 2}, {time: 21, lane: 0},
            {time: 22, lane: 1}, {time: 22, lane: 2},
            {time: 24, lane: 3}, {time: 25, lane: 0},
            {time: 26, lane: 2}, {time: 27, lane: 1},
            {time: 28, lane: 3}, {time: 29, lane: 0},
            // Chorus (faster pattern)
            {time: 30, lane: 0}, {time: 30.5, lane: 2},
            {time: 31, lane: 1}, {time: 31.5, lane: 3},
            {time: 32, lane: 0}, {time: 32.5, lane: 1},
            {time: 33, lane: 2}, {time: 33.5, lane: 3},
            {time: 34, lane: 0}, {time: 34, lane: 3},
            {time: 35, lane: 1}, {time: 35, lane: 2},
            {time: 36, lane: 0}, {time: 36.5, lane: 3},
            {time: 37, lane: 2}, {time: 37.5, lane: 1},
            {time: 38, lane: 0}, {time: 38.5, lane: 2},
            {time: 39, lane: 3}, {time: 39.5, lane: 1},
            // Verse 2
            {time: 42, lane: 2}, {time: 43, lane: 1},
            {time: 44, lane: 0}, {time: 45, lane: 3},
            {time: 46, lane: 2}, {time: 46, lane: 0},
            {time: 48, lane: 1}, {time: 49, lane: 3},
            {time: 50, lane: 0}, {time: 51, lane: 2},
            {time: 52, lane: 1}, {time: 53, lane: 3},
            {time: 54, lane: 0}, {time: 54.5, lane: 2},
            {time: 55, lane: 3}, {time: 55.5, lane: 1},
            // Outro
            {time: 58, lane: 0}, {time: 58, lane: 3},
            {time: 60, lane: 1}, {time: 60, lane: 2},
            {time: 62, lane: 0}, {time: 62, lane: 1},
            {time: 62, lane: 2}, {time: 62, lane: 3},
        ]
    },
    {
        id: 'trap_beat',
        name: 'Modern Trap',
        icon: '🔥',
        description: 'Sert ve Dinamik - 808 Bass',
        bpm: 120,
        notes: [
            // Intro
            {time: 4, lane: 1}, {time: 6, lane: 2},
            {time: 8, lane: 0}, {time: 8, lane: 3},
            // Build up
            {time: 10, lane: 0}, {time: 11, lane: 1},
            {time: 12, lane: 2}, {time: 13, lane: 3},
            {time: 14, lane: 0}, {time: 15, lane: 1},
            {time: 16, lane: 2}, {time: 16.5, lane: 3},
            {time: 17, lane: 0}, {time: 17.5, lane: 1},
            {time: 18, lane: 2}, {time: 18.5, lane: 3},
            // Drop
            {time: 20, lane: 0}, {time: 20, lane: 3},
            {time: 20.5, lane: 1}, {time: 20.5, lane: 2},
            {time: 21, lane: 0}, {time: 21.5, lane: 3},
            {time: 22, lane: 1}, {time: 22.5, lane: 2},
            {time: 23, lane: 0}, {time: 23, lane: 1},
            {time: 24, lane: 2}, {time: 24, lane: 3},
            {time: 24.5, lane: 0}, {time: 25, lane: 1},
            {time: 25.5, lane: 2}, {time: 26, lane: 3},
            {time: 26.5, lane: 0}, {time: 27, lane: 1},
            {time: 27.5, lane: 2}, {time: 28, lane: 3},
            // Break
            {time: 30, lane: 2}, {time: 32, lane: 1},
            {time: 34, lane: 0}, {time: 34, lane: 3},
            // Second Drop
            {time: 36, lane: 0}, {time: 36.5, lane: 1},
            {time: 37, lane: 2}, {time: 37.5, lane: 3},
            {time: 38, lane: 0}, {time: 38, lane: 2},
            {time: 39, lane: 1}, {time: 39, lane: 3},
            {time: 40, lane: 0}, {time: 40.5, lane: 1},
            {time: 41, lane: 2}, {time: 41.5, lane: 3},
            {time: 42, lane: 0}, {time: 42.5, lane: 2},
            {time: 43, lane: 1}, {time: 43.5, lane: 3},
            {time: 44, lane: 0}, {time: 44, lane: 1},
            {time: 44, lane: 2}, {time: 44, lane: 3},
            // Outro
            {time: 48, lane: 0}, {time: 48, lane: 3},
            {time: 50, lane: 1}, {time: 50, lane: 2},
        ]
    },
    {
        id: 'funk_breakbeat',
        name: 'Funk Breakbeat',
        icon: '🎸',
        description: 'Klasik B-Boy Tarzı - Groovy',
        bpm: 115,
        notes: [
            // Groove intro
            {time: 2, lane: 1}, {time: 3, lane: 2},
            {time: 4, lane: 0}, {time: 5, lane: 3},
            {time: 6, lane: 1}, {time: 7, lane: 0},
            // Funky pattern
            {time: 8, lane: 2}, {time: 8.5, lane: 3},
            {time: 9, lane: 0}, {time: 9.5, lane: 1},
            {time: 10, lane: 2}, {time: 10.5, lane: 3},
            {time: 11, lane: 0}, {time: 11.5, lane: 1},
            {time: 12, lane: 2}, {time: 13, lane: 0},
            {time: 14, lane: 3}, {time: 15, lane: 1},
            // Soul break
            {time: 16, lane: 0}, {time: 16, lane: 2},
            {time: 18, lane: 1}, {time: 18, lane: 3},
            {time: 20, lane: 0}, {time: 20.5, lane: 1},
            {time: 21, lane: 2}, {time: 21.5, lane: 3},
            // Groove section
            {time: 22, lane: 0}, {time: 22.5, lane: 2},
            {time: 23, lane: 1}, {time: 23.5, lane: 3},
            {time: 24, lane: 0}, {time: 25, lane: 1},
            {time: 26, lane: 2}, {time: 26, lane: 3},
            {time: 27, lane: 0}, {time: 27.5, lane: 1},
            {time: 28, lane: 2}, {time: 28.5, lane: 0},
            {time: 29, lane: 3}, {time: 29.5, lane: 1},
            {time: 30, lane: 2}, {time: 30, lane: 0},
            // Brass hit section
            {time: 32, lane: 0}, {time: 32, lane: 1},
            {time: 32, lane: 2}, {time: 32, lane: 3},
            {time: 34, lane: 0}, {time: 34, lane: 3},
            {time: 36, lane: 1}, {time: 36, lane: 2},
            {time: 38, lane: 0}, {time: 38, lane: 1},
            {time: 38, lane: 2}, {time: 38, lane: 3},
            // Finale groove
            {time: 40, lane: 0}, {time: 40.5, lane: 1},
            {time: 41, lane: 2}, {time: 41.5, lane: 3},
            {time: 42, lane: 0}, {time: 42.5, lane: 2},
            {time: 43, lane: 1}, {time: 43.5, lane: 3},
            {time: 44, lane: 0}, {time: 44, lane: 1},
            {time: 44, lane: 2}, {time: 44, lane: 3},
        ]
    },
    {
        id: 'lofi_rap',
        name: 'Lo-Fi Rap',
        icon: '🎹',
        description: 'Antrenman Modu - Chill Vibes',
        bpm: 95,
        notes: [
            // Chill intro
            {time: 4, lane: 2}, {time: 6, lane: 1},
            {time: 8, lane: 0}, {time: 10, lane: 3},
            // Steady groove
            {time: 12, lane: 0}, {time: 14, lane: 2},
            {time: 16, lane: 1}, {time: 18, lane: 3},
            {time: 20, lane: 0}, {time: 21, lane: 2},
            {time: 22, lane: 1}, {time: 23, lane: 3},
            {time: 24, lane: 0}, {time: 25, lane: 1},
            {time: 26, lane: 2}, {time: 27, lane: 3},
            // Jazz piano section
            {time: 28, lane: 0}, {time: 28, lane: 2},
            {time: 30, lane: 1}, {time: 30, lane: 3},
            {time: 32, lane: 0}, {time: 33, lane: 1},
            {time: 34, lane: 2}, {time: 35, lane: 3},
            {time: 36, lane: 0}, {time: 37, lane: 2},
            {time: 38, lane: 1}, {time: 39, lane: 3},
            // Smooth ending
            {time: 40, lane: 0}, {time: 41, lane: 1},
            {time: 42, lane: 2}, {time: 43, lane: 3},
            {time: 44, lane: 0}, {time: 44, lane: 3},
            {time: 46, lane: 1}, {time: 46, lane: 2},
        ]
    },
    {
        id: 'underground_hardcore',
        name: 'Underground Hardcore',
        icon: '💀',
        description: 'Final Sahnesi - Dramatik',
        bpm: 105,
        notes: [
            // Cinematic intro
            {time: 4, lane: 0}, {time: 4, lane: 3},
            {time: 8, lane: 1}, {time: 8, lane: 2},
            // Build
            {time: 10, lane: 0}, {time: 11, lane: 1},
            {time: 12, lane: 2}, {time: 13, lane: 3},
            {time: 14, lane: 0}, {time: 14.5, lane: 1},
            {time: 15, lane: 2}, {time: 15.5, lane: 3},
            // Heavy percussion
            {time: 16, lane: 0}, {time: 16.5, lane: 2},
            {time: 17, lane: 1}, {time: 17.5, lane: 3},
            {time: 18, lane: 0}, {time: 18.5, lane: 1},
            {time: 19, lane: 2}, {time: 19.5, lane: 3},
            {time: 20, lane: 0}, {time: 20, lane: 1},
            {time: 21, lane: 2}, {time: 21, lane: 3},
            {time: 22, lane: 0}, {time: 22.5, lane: 1},
            {time: 23, lane: 2}, {time: 23.5, lane: 3},
            // Championship battle
            {time: 24, lane: 0}, {time: 24, lane: 3},
            {time: 25, lane: 1}, {time: 25, lane: 2},
            {time: 26, lane: 0}, {time: 26.5, lane: 1},
            {time: 27, lane: 2}, {time: 27.5, lane: 3},
            {time: 28, lane: 0}, {time: 28.5, lane: 3},
            {time: 29, lane: 1}, {time: 29.5, lane: 2},
            {time: 30, lane: 0}, {time: 30, lane: 2},
            {time: 31, lane: 1}, {time: 31, lane: 3},
            // Intense finale
            {time: 32, lane: 0}, {time: 32.5, lane: 1},
            {time: 33, lane: 2}, {time: 33.5, lane: 3},
            {time: 34, lane: 0}, {time: 34.5, lane: 1},
            {time: 35, lane: 2}, {time: 35.5, lane: 3},
            {time: 36, lane: 0}, {time: 36, lane: 1},
            {time: 36.5, lane: 2}, {time: 36.5, lane: 3},
            {time: 37, lane: 0}, {time: 37, lane: 1},
            {time: 37.5, lane: 2}, {time: 37.5, lane: 3},
            // Grand finale
            {time: 38, lane: 0}, {time: 38, lane: 1},
            {time: 38, lane: 2}, {time: 38, lane: 3},
            {time: 40, lane: 0}, {time: 40, lane: 1},
            {time: 40, lane: 2}, {time: 40, lane: 3},
        ]
    }
];

// Difficulty modifiers: adjusts note density
function getNotesForDifficulty(song, difficulty) {
    const notes = [...song.notes];
    
    if (difficulty === 'easy') {
        // Remove half-beat notes and double notes for easy mode
        const filtered = [];
        const usedTimes = new Set();
        for (const note of notes) {
            if (note.time % 1 !== 0) continue; // Skip half-beat notes
            const key = `${note.time}`;
            if (usedTimes.has(key)) continue; // Skip doubles
            usedTimes.add(key);
            filtered.push(note);
        }
        return filtered;
    }
    
    if (difficulty === 'medium') {
        return notes;
    }
    
    if (difficulty === 'hard') {
        // Add extra notes between existing ones
        const extra = [];
        for (let i = 0; i < notes.length - 1; i++) {
            extra.push(notes[i]);
            const gap = notes[i + 1].time - notes[i].time;
            if (gap >= 2) {
                const lanes = [0, 1, 2, 3];
                const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
                extra.push({
                    time: notes[i].time + gap / 2,
                    lane: randomLane
                });
            }
        }
        extra.push(notes[notes.length - 1]);
        return extra;
    }
    
    return notes;
}

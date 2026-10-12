// ===== 2D Multiplayer Room Synchronization Engine =====
// BroadcastChannel & LocalStorage Room Syncing for Multi-tab / Multi-device Collaboration

export class RoomManager {
  constructor(player) {
    this.player = player;
    this.roomCode = 'ROOM-101';
    this.myId = 'p_' + Math.random().toString(36).substring(2, 9);
    this.myName = 'นักวิจัย ' + Math.floor(10 + Math.random() * 90);
    this.remotePlayers = new Map(); // id -> { id, name, x, y, avatar, lastSeen, hasItem }
    this.channel = null;
    this.syncInterval = null;

    this.initChannel();
  }

  initChannel() {
    try {
      this.channel = new BroadcastChannel('cell_2d_multiplayer_rooms');
      this.channel.onmessage = (e) => this.handleMessage(e.data);
    } catch (err) {
      console.warn('BroadcastChannel not supported, using storage fallback');
    }

    // Storage fallback for cross-window
    window.addEventListener('storage', (e) => {
      if (e.key === 'cell_2d_sync_event' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          this.handleMessage(data);
        } catch (err) {}
      }
    });

    // Broadcast position every 100ms
    this.syncInterval = setInterval(() => {
      this.broadcastPosition();
      this.pruneOldPlayers();
    }, 120);
  }

  setRoomCode(code) {
    const clean = code.trim().toUpperCase() || 'ROOM-101';
    this.roomCode = clean;
    this.remotePlayers.clear();
    const input = document.getElementById('room-code-input');
    if (input) input.value = clean;
    this.broadcastMessage({
      type: 'PLAYER_JOIN',
      room: this.roomCode,
      id: this.myId,
      name: this.myName
    });
  }

  broadcastPosition() {
    if (!this.player) return;
    this.broadcastMessage({
      type: 'PLAYER_MOVE',
      room: this.roomCode,
      id: this.myId,
      name: this.myName,
      x: this.player.x,
      y: this.player.y,
      avatar: this.player.avatarType || 'fox',
      isMoving: this.player.isMoving
    });
  }

  broadcastQuestCompleted(questName) {
    this.broadcastMessage({
      type: 'QUEST_COMPLETED',
      room: this.roomCode,
      id: this.myId,
      name: this.myName,
      questName: questName
    });
  }

  broadcastMessage(data) {
    if (this.channel) {
      try { this.channel.postMessage(data); } catch (e) {}
    }
    try {
      localStorage.setItem('cell_2d_sync_event', JSON.stringify({ ...data, _ts: Date.now() }));
    } catch (e) {}
  }

  handleMessage(data) {
    if (!data || data.room !== this.roomCode || data.id === this.myId) return;

    if (data.type === 'PLAYER_MOVE') {
      this.remotePlayers.set(data.id, {
        id: data.id,
        name: data.name,
        x: data.x,
        y: data.y,
        avatar: data.avatar || 'fox',
        isMoving: data.isMoving,
        lastSeen: performance.now()
      });
    } else if (data.type === 'QUEST_COMPLETED') {
      const toast = document.getElementById('hud-toast');
      if (toast) {
        toast.textContent = `🎉 เพื่อนร่วมห้อง [${data.name}] ทำภารกิจ ${data.questName} สำเร็จ!`;
        toast.classList.add('visible');
        setTimeout(() => toast.classList.remove('visible'), 4000);
      }
    }
  }

  pruneOldPlayers() {
    const now = performance.now();
    for (const [id, p] of this.remotePlayers.entries()) {
      if (now - p.lastSeen > 4000) {
        this.remotePlayers.delete(id);
      }
    }
  }

  renderRemotePlayers(ctx, camera) {
    for (const p of this.remotePlayers.values()) {
      const rx = p.x - camera.x;
      const ry = p.y - camera.y;

      // Draw avatar circle
      ctx.save();
      ctx.fillStyle = '#06B6D4';
      ctx.beginPath();
      ctx.arc(rx, ry + 10, 14, 0, Math.PI * 2);
      ctx.fill();

      // Emoji
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(p.avatar === 'slime' ? '🐌' : '🦊', rx, ry + 16);

      // Nametag pill
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(rx - 36, ry - 14, 72, 16);
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 1;
      ctx.strokeRect(rx - 36, ry - 14, 72, 16);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px "Prompt", sans-serif';
      ctx.fillText(p.name, rx, ry - 2);
      ctx.restore();
    }
  }
}

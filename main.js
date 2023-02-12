"use strict";

function warnUserDisconnected(user) {
	ui.notifications.warn(`${user} disconnected!`);
}

const debouncedWarn = debounce(warnUserDisconnected, 300);

Hooks.on("ready", () => {
	libWrapper.register(
		"bugdisconnect",
		"Users.prototype.constructor._handleUserActivity",
		function (wrapped, userId, activityData = {}) {
			if (game.user.isGM) {
				const user = game.users.get(userId);
				if (!user) return;

				// Update User active state
				let active = "active" in activityData ? activityData.active : true;
				if (user.active !== active && !active) {
					debouncedWarn(user.name);
				}
			}
			wrapped(userId, activityData);
		},
		"WRAPPER"
	);
});

new Vue({
    el: '#app',
    data: {
        player_hp: 100,
        monster_hp: 100,
        battle_log: [],
        game_active: false,
        displaying_results: false,
        player_won: -1, // -1=game reset, 0=player lost, 1=player won
    },
    methods: {
        randomInt: function(min, max) {
            return Math.floor(Math.random()*(max-min+1)+min)
        },
        exchange: function(exchange_type = "attack") {
            var stop_game = false
            if (exchange_type === "attack") {
                stop_game = this.attack_monster()
            } else if (exchange_type === "special_attack") {
                stop_game = this.attack_monster(2)
            } else {
                this.heal_player()
            }
            if (!stop_game)
                this.attack_player()
        },
        attack_monster: function(damage_muliplier = 1) {
            var monster_damage = this.randomInt(10,25 * damage_muliplier)
            this.monster_hp -= monster_damage
            this.battle_log.unshift({
                    entry_type: {'player-turn' : true},
                    text: "Player attacks monster for " + monster_damage + " hit points!"
                })
            return this.check_game_status()
        },
        attack_player: function() {
            var player_damage = this.randomInt(10,30)
            this.player_hp -= player_damage
            this.battle_log.unshift({
                entry_type: {'monster-turn' : true},
                text: "Monster attacks player for " + player_damage + " hit points!"
            })
            return this.check_game_status()
        },
        heal_player: function() {
            if (this.player_hp >= 100) {
                this.battle_log.unshift({
                    entry_type: {'player-heal' : true},
                    text: "Player performs unsuccessful heal spell."
                })
                return
            }
            var heal_amount = this.randomInt(5,20)
            this.player_hp += heal_amount
            this.battle_log.unshift({
                entry_type: {'player-heal' : true},
                text: "Player performs heal of " + heal_amount + " hit points!"
            })
        },
        display_results: function() {
            this.displaying_results = true
            if (this.player_won === 1) {
                this.battle_log.unshift({
                    entry_type: {'player-win' : true},
                    text: "You win!"
                })
            } else if (this.player_won === 0) {
                this.battle_log.unshift({
                    entry_type: {'player-lose' : true},
                    text: "You lose!"
                })
            }
        },
        reset_game: function() {
            this.game_active = false
            this.displaying_results = false
            this.player_hp = 100
            this.monster_hp = 100
            this.battle_log = []
            this.player_won = -1
        },
        check_game_status : function() {
            if (this.monster_hp <= 0 || this.player_hp <= 0 || !this.game_active) {
                    if (this.game_active) 
                        this.player_won = this.player_hp > 0 ? 1 : 0
                    this.display_results()
                    return true
            }
        }
    }
})
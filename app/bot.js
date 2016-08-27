'use strict';

const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const config = require('./config');
const unirest = require('unirest');

const Bot = new Telegram.Telegram(config.tokens.telegram);

class SearchController extends TelegramBaseController {
  /**
   * @param {Scope} $
   */
  searchHandler($) {
    const { firstName } = $.message.from;

    const form = {
      searchQuery: {
        q: `${firstName}, what should I search for?`,
        error: 'Sorry, wrong input',
        validator: (message, callback) => {
          if (message.text) {
            callback(true, message.text);
            return;
          }

          callback(false);
        }
      }
    };

    $.runForm(form, (result) => {
      const { searchQuery } = result;

      unirest.get(`http://127.0.0.1:3030/search/cards/${searchQuery}`)
      .header("Accept", "application/json")
      .end((result) => {
        console.log(result);

        if (result.body[0]) {
          const { img } = result.body[0];
          $.sendPhoto({ url: img, filename: 'ysera.png'});
        } else {
          $.sendMessage(result.body.message);
        }

      });
    });
  }

  get routes() {
    return {
      'search': 'searchHandler'
    }
  }
}

Bot.router.when(['search'], new SearchController())

module.exports = (robot) ->
  robot.hear /taboola/i, (msg) ->
    robot.http("http://web.adblade.com/impsc.php?cid=5706-2526007792&_=1412976253037")
    .get() (err, res, body) ->
      try
        json = JSON.parse(body)
        ads = json.ads
        ad = ads[Math.floor(Math.random() * ads.length)]
        msg.send "#{ad.description} #{ad.img}"
      catch error
        msg.send "No taboola for you-la"

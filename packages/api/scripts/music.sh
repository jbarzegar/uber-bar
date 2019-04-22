#!/bin/bash

read -r running <<<"$(ps -ef | grep \"MacOS/Spotify\" | grep -v \"grep\" | wc -l)" &&
test $running != 0 &&
IFS='|' read -r theTrack <<<"$(osascript <<<'if application "Spotify" is running then
  tell application "Spotify"
    if player state is playing or player state is paused then
      set theTrack to name of current track
      set theArtist to artist of current track
      set isPaused to player state is paused
      return theArtist - theTrack
    else
      return "no song selected"
    end if
  end tell
else
  return "Spotify is not running"
end if')" &&

echo "$theTrack"

radio.setGroup(1)
radio.setTransmitPower(7)
radio.setTransmitSerialNumber(true)
let learning = 0
let data_list = [control.deviceSerialNumber()]
// funkce
radio.onReceivedValue(function received(name: string, value: number) {
    let learned_serial: number;
    
    let remote_serial = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    console.logValue("remote", remote_serial)
    if (learning == 1) {
        if (name == "learn" && value == 1) {
            learned_serial = radio.receivedPacket(RadioPacketProperty.SerialNumber)
            if (data_list.indexOf(learned_serial) < 0) {
                data_list.push(learned_serial)
            }
            
            console.logValue("learned", remote_serial)
        }
        
    }
    
    for (let serialek of data_list) {
        if (remote_serial == serialek) {
            if (name == "alarm" && value == 1) {
                music.playTone(Note.C, 0)
            } else if (name == "alarm" && value == 0) {
                music.stopAllSounds()
            }
            
        }
        
        console.log("remote_serial: " + remote_serial + " learned_serial: " + learned_serial)
    }
})
input.onButtonPressed(Button.A, function on_alarm() {
    radio.sendValue("alarm", 1)
})
input.onButtonPressed(Button.B, function off_alarm() {
    radio.sendValue("alarm", 0)
})
input.onLogoEvent(TouchButtonEvent.Pressed, function send_learn() {
    radio.sendValue("learn", 1)
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function learn() {
    
    if (learning == 0) {
        learning = 1
        basic.showIcon(IconNames.Yes)
    } else {
        basic.clearScreen()
        learning = 0
    }
    
})

radio.set_group(1)
radio.set_transmit_power(7)
radio.set_transmit_serial_number(True)

learning = 0
data_list = [control.device_serial_number()]

#funkce
radio.on_received_value(received)
input.on_button_pressed(Button.A, on_alarm)
input.on_button_pressed(Button.B, off_alarm)
input.on_logo_event(TouchButtonEvent.PRESSED, send_learn)
input.on_logo_event(TouchButtonEvent.LONG_PRESSED, learn)


def received(name, value):
    global learning, data_list
    remote_serial = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
    console.log_value("remote", remote_serial)
    if learning == 1:
        if name == "learn" and value == 1:
            learned_serial = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
            if learned_serial not in data_list:
                data_list.append(learned_serial)
            console.log_value("learned", remote_serial)
    for serialek in data_list:
        if remote_serial == serialek:
            if name == "alarm" and value == 1:
                music.play_tone(Note.C, 0)
            elif name == "alarm" and value == 0:
                music.stop_all_sounds()
        print("remote_serial: "+remote_serial+" learned_serial: "+learned_serial)


def on_alarm():
    radio.sendValue("alarm", 1)

def off_alarm():
    radio.sendValue("alarm", 0)
    music.stop_all_sounds()

def learn():
    global learning
    if learning == 0:
        learning = 1
        basic.show_icon(IconNames.YES)
    else:
        basic.clear_screen()
        learning = 0

def send_learn():
    radio.sendValue("learn", 1)
use std::{process::Command, /*fs,*/ io::{stdin, stdout, Write}};

fn main() {
    let cmd = "python3";
    let script = "src/main.py";

    let mut swimmer_id = String::new();
    print!("Enter your swimmer id: ");

    stdout()
        .flush()
        .expect("Failed to flush stream buffer!");

    stdin()
        .read_line(&mut swimmer_id)
        .expect("Could not read input!");

    Command::new(cmd)
        .args([script, swimmer_id.trim()])
        .status()
        .expect("{cmd} command failed to start!");

    //let raw_contents = fs::read_to_string("src/test.txt")
        //.expect("Could not open file!");

    //println!("{raw_contents}");
}

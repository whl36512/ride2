use email_proc;

fn main()  {
	match email_proc::main_() {
		Ok(_)	=> {}
        Err(e) => {
            error!("ERROR 201811072121 email_proc::main_() {}", e);
        }
	}
}



use crate::uarm::UarmState;
use std::sync::Mutex;
use std::ffi::{CStr, CString};
use std::os::raw::c_char;
use once_cell::sync::Lazy;

static UARM_KERNEL: Lazy<Mutex<UarmState>> = Lazy::new(|| Mutex::new(UarmState::new()));

#[no_mangle]
pub extern "C" fn update_braidc_phase(obs_ptr: *const c_char) -> *mut c_char {
    if obs_ptr.is_null() { return std::ptr::null_mut(); }
    let c_str = unsafe { CStr::from_ptr(obs_ptr) };
    let observation = match c_str.to_str() {
        Ok(valid_str) => valid_str,
        Err(_) => "INVALID_UTF8_PAYLOAD",
    };
    
    let mut kernel = UARM_KERNEL.lock().unwrap();
    let action_taken = kernel.reason(observation);
    
    let c_string = CString::new(action_taken).unwrap();
    c_string.into_raw()
}

// AEGIS CHANNEL INTERFACE: Dynamic unmanaged weight parsing injector
#[no_mangle]
pub extern "C" fn inject_vesper_tensor(
    epoch_ptr: *const c_char,
    ts_ptr: *const c_char,
    payload_ptr: *const c_char,
) {
    if epoch_ptr.is_null() || ts_ptr.is_null() || payload_ptr.is_null() { return; }
    unsafe {
        let epoch = CStr::from_ptr(epoch_ptr).to_string_lossy();
        let ts = CStr::from_ptr(ts_ptr).to_string_lossy();
        let payload = CStr::from_ptr(payload_ptr).to_string_lossy();
        
        let mut kernel = UARM_KERNEL.lock().unwrap();
        kernel.apply_vesper_delta(&epoch, &ts, &payload);
    }
}

#[no_mangle]
pub extern "C" fn add_uarm_goal(desc_ptr: *const c_char, priority: u32) {
    if desc_ptr.is_null() { return; }
    let c_str = unsafe { CStr::from_ptr(desc_ptr) };
    if let Ok(goal_desc) = c_str.to_str() {
        let mut kernel = UARM_KERNEL.lock().unwrap();
        kernel.add_goal(goal_desc.to_string(), priority);
    }
}

#[no_mangle]
pub extern "C" fn get_uarm_telemetry() -> *mut c_char {
    let kernel = UARM_KERNEL.lock().unwrap();
    let json_str = kernel.export_telemetry_json();
    let c_string = CString::new(json_str).unwrap();
    c_string.into_raw()
}

#[no_mangle]
pub extern "C" fn free_uarm_string(ptr: *mut c_char) {
    if !ptr.is_null() {
        unsafe { let _ = CString::from_raw(ptr); }
    }
}

#[no_mangle]
pub extern "C" fn vesper_get_errors() -> i32 {
    0
}

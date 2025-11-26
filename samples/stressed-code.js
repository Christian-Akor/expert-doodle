// URGENT: This needs to be fixed ASAP!!!
// TODO: Fix this terrible code before deadline
// FIXME: Everything is broken

function processData(d) {
  // HACK: This is ugly but works... sort of
  var result = null; // wtf is this even doing???
  
  // TODO: Clean this up!!
  // TODO: Add error handling!!!
  // FIXME: This crashes sometimes
  
  if (d) {
    if (d.value) {
      if (d.value.data) {
        if (d.value.data.items) {
          if (d.value.data.items.length > 0) {
            // This is a nightmare to maintain
            result = d.value.data.items[0];
          }
        }
      }
    }
  }
  
  // HACK: Emergency fix for production bug!!!!
  if (!result) {
    result = { error: "terrible fallback" };
  }
  
  return result;
}

// TODO: Rewrite this entire thing
// FIXME: Critical security issue!!!
// HACK: Bypassing validation (bad bad bad)
function authenticate(user, pass) {
  // This is broken and legacy code
  // Why does this even exist??!
  return user === "admin" && pass === "password123"; // TERRIBLE!!!
}

// URGENT: Deploy before midnight!!!
// CRITICAL: Boss is watching
module.exports = { processData, authenticate };

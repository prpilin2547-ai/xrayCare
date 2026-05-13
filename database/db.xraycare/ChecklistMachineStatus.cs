namespace db.xraycare;

/// <summary>Daily checklist completion state per machine (see Machine.Status).</summary>
public enum ChecklistMachineStatus
{
    unCheck = 0,
    Checked = 1,
    Waiting = 2
}

using UnityEngine;
using System.Collections;

public class Neighbor {
    public string url;
    public float degreesRotated;
    public Neighbor(string u, float d)
    {
        url = u;
        degreesRotated = d;
    }

    public Neighbor(string result)
    {
        string[] split = result.Split(',');
        url = split[0];
        degreesRotated = float.Parse(split[1]);
    }
}

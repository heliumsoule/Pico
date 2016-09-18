using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;

public class TextCache {
    static Dictionary<string, List<Neighbor>> cache = new Dictionary<string, List<Neighbor>>();
    public static IEnumerator fetch(string url, Action<List<Neighbor>> callback)
    {
        Debug.Log("fetching text : " + url);
        if (cache.ContainsKey(url))
        {
            callback(cache[url]);
        } else
        {
            WWW www = new WWW(url);
            yield return www;
            string[] result = www.text.Split('\n');
            List<Neighbor> neighbors = new List<Neighbor>();
            foreach(string s in result)
            {
                neighbors.Add(new Neighbor(s));
            }
            cache.Add(url, neighbors);
            callback(neighbors);
        }
    }
}

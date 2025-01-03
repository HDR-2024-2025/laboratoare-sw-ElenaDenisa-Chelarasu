#!/usr/bin/env python3
import argparse
import json
import time
from collections import defaultdict
from pathlib import Path
import re
from typing import Dict, Set, List, Tuple

class LogAnalyzer:
    def __init__(self, log_dir: str):
        self.log_dir = Path(log_dir)
        self.url_pattern = re.compile(r'(\S+)\s+\[(\d+)\]\s+(\S+)\s+(\w+)\s+(\S+)\s+(\S+)\s+(\d{3})')
        
    def read_logs(self) -> List[dict]:
        """Read all log files in the specified directory."""
        logs = []
        for log_file in self.log_dir.glob('console*.txt'):
            with open(log_file, 'r') as f:
                for line in f:
                    try:
                        log_entry = json.loads(line)
                        logs.append(log_entry)
                    except json.JSONDecodeError:
                        continue
        return logs

    def analyze_4xx_errors(self) -> List[Tuple[str, str]]:
        """Analyze logs and return URLs and IPs with 4xx status codes."""
        error_requests = []
        logs = self.read_logs()
        
        for log in logs:
            try:
                status_code = int(log.get('statusCode', 0))
                if 400 <= status_code < 500:
                    url = log.get('route', '')
                    ip = log.get('ip', '')
                    if url and ip:
                        error_requests.append((url, ip))
            except ValueError:
                continue
                
        return sorted(error_requests)

    def analyze_url_stats(self) -> List[Tuple[str, int, Set[str]]]:
        """Analyze logs and return URL statistics."""
        url_stats = defaultdict(lambda: {'count': 0, 'status_codes': set()})
        logs = self.read_logs()
        
        for log in logs:
            url = log.get('route', '')
            if url:
                url_stats[url]['count'] += 1
                url_stats[url]['status_codes'].add(str(log.get('statusCode', 'N/A')))
                
        # Convert to list of tuples for sorting
        stats_list = [
            (url, stats['count'], stats['status_codes'])
            for url, stats in url_stats.items()
        ]
        return sorted(stats_list, key=lambda x: (-x[1], x[0]))  # Sort by count (desc) then URL (asc)

    def watch_logs(self):
        """Watch log directory for new entries in real-time."""
        import subprocess
        
        # Using tail -f equivalent functionality
        if Path('/usr/bin/tail').exists():  # Unix-like systems
            log_files = list(self.log_dir.glob('console*.txt'))
            if not log_files:
                print("No log files found!")
                return
                
            newest_log = max(log_files, key=lambda p: p.stat().st_mtime)
            try:
                subprocess.run(['tail', '-f', str(newest_log)], check=True)
            except KeyboardInterrupt:
                print("\nStopped watching logs.")
        else:  # Fallback for Windows or systems without tail
            last_position = defaultdict(int)
            try:
                while True:
                    found_new_data = False
                    for log_file in self.log_dir.glob('console*.txt'):
                        with open(log_file, 'r') as f:
                            f.seek(last_position[log_file])
                            new_lines = f.readlines()
                            if new_lines:
                                found_new_data = True
                                print(''.join(new_lines), end='')
                                last_position[log_file] = f.tell()
                    
                    if not found_new_data:
                        time.sleep(1)
            except KeyboardInterrupt:
                print("\nStopped watching logs.")

def main():
    parser = argparse.ArgumentParser(description='Analyze Winston logger output files')
    parser.add_argument('mode', type=int, choices=[1, 2, 3],
                       help='1: Show 4xx errors, 2: Show URL stats, 3: Watch logs')
    parser.add_argument('--log-dir', default='./logs',
                       help='Directory containing log files (default: ./logs)')
    
    args = parser.parse_args()
    analyzer = LogAnalyzer(args.log_dir)
    
    if args.mode == 1:
        print("\n=== 4xx Error Requests ===")
        errors = analyzer.analyze_4xx_errors()
        if errors:
            for url, ip in errors:
                print(f"URL: {url:<30} Source IP: {ip}")
        else:
            print("No 4xx errors found.")
            
    elif args.mode == 2:
        print("\n=== URL Statistics ===")
        stats = analyzer.analyze_url_stats()
        if stats:
            for url, count, status_codes in stats:
                status_codes_str = ', '.join(sorted(status_codes))
                print(f"URL: {url:<30} Visits: {count:<5} Status Codes: {status_codes_str}")
        else:
            print("No URLs found in logs.")
            
    elif args.mode == 3:
        print("\n=== Watching Logs (Press Ctrl+C to stop) ===")
        analyzer.watch_logs()

if __name__ == '__main__':
    main()